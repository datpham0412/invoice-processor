using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InvoiceProcessor.API.Application.Services;   // <- UploadInvoiceService
using InvoiceProcessor.API.Application.Models;    // <- MatchResult DTO
using InvoiceProcessor.API.Domain.Enums;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Domain.Exceptions;
using InvoiceProcessor.API.Application.Interfaces;
using System.IO;

namespace InvoiceProcessor.API.Controllers;
[ApiController]
[Route("api/invoices")]
[Produces("application/json")]
public class InvoiceUploadController : ControllerBase
{
    private readonly UploadInvoiceService _uploadService;
    private readonly IBlobStorage _blobStorage;

    public InvoiceUploadController(
        UploadInvoiceService uploadService,
        IBlobStorage blobStorage)
    {
        _uploadService = uploadService;
        _blobStorage = blobStorage;
    }

    /// <summary>Uploads a PDF and returns both the Invoice and the MatchResult.</summary>
    /// <remarks>Consumes multipart/form-data so you can test in Swagger UI.</remarks>
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<UploadInvoiceResponse>> Upload(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "Please upload a non-empty PDF." });

        await using var stream = file.OpenReadStream();

        try
        {
            var invoice = await _uploadService.ProcessUploadAsync(stream, file.FileName);

            var response = new UploadInvoiceResponse
            {
                InvoiceId = invoice.Id,
                Status = invoice.Status,
                BlobUrl = Url.Action(
                    nameof(Download),
                    "InvoiceUpload",
                    new { fileName = Path.GetFileName(invoice.BlobUrl) },
                    Request.Scheme),
                FailureReason = invoice.ExceptionRecords?.FirstOrDefault()?.Reason
            };

            return Ok(response);
        }
        catch (DuplicateInvoiceException ex)
        {
            // Console.WriteLine($"Duplicate invoice: {ex.Message}");
            return Conflict(new { message = ex.Message }); // 409 Conflict
        }
        catch (InvalidOperationException ex)
        {
            // Console.WriteLine($"Invalid operation: {ex.Message}");
            return BadRequest(new { message = ex.Message }); // OCR failure etc.
        }
    }

    /// <summary>Downloads a PDF file by its name.</summary>
    /// <param name="fileName">The name of the file to download</param>
    /// <returns>The PDF file</returns>
    /// <response code="200">Returns the PDF file</response>
    /// <response code="404">If the file is not found</response>
    [HttpGet("file/{fileName}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Download(string fileName)
    {
        try
        {
            var stream = await _blobStorage.DownloadAsync(fileName);

            Response.Headers.ContentDisposition = $"inline; filename=\"{fileName}\"";
            return File(stream, "application/pdf");
        }
        catch (FileNotFoundException)
        {
            return NotFound($"File {fileName} not found");
        }
    }
}

/// <summary>Shape returned to the front-end.</summary>
public sealed class UploadInvoiceResponse
{
    public Guid           InvoiceId     { get; set; }
    public InvoiceStatus  Status        { get; set; }
    public string?        BlobUrl       { get; set; }
    public string?        FailureReason { get; set; }
}
