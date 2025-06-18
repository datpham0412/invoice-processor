using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InvoiceProcessor.API.Application.Services;   
using InvoiceProcessor.API.Domain.Enums;
using InvoiceProcessor.API.Domain.Exceptions;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Infrastructure.Persistence;
namespace InvoiceProcessor.API.Controllers;
using System.Security.Claims;
using System.IO;
using InvoiceProcessor.API.Application.Models;


[Authorize]
[ApiController]
[Route("api/invoices")]
[Produces("application/json")]
public class InvoiceUploadController : ControllerBase
{
    private readonly UploadInvoiceService _uploadService;
    private readonly IBlobStorage _blobStorage;
    private readonly AppDbContext _ctx;

    public InvoiceUploadController(
        UploadInvoiceService uploadService,
        IBlobStorage blobStorage,
        AppDbContext ctx)
    {
        _uploadService = uploadService;
        _blobStorage = blobStorage;
        _ctx = ctx;
    }
    
    /* -----------------------  UPLOAD  ----------------------- */
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<UploadInvoiceResponse>> Upload(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "Please upload a non-empty PDF." });

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        await using var stream = file.OpenReadStream();

        try
        {
            var invoice = await _uploadService.ProcessUploadAsync(stream, file.FileName, userId);
            var safeName = Uri.EscapeDataString(Path.GetFileName(invoice.BlobUrl));
            
            // Save only the relative file route in DB
            invoice.BlobUrl = $"/api/invoices/file/{safeName}";
            await _ctx.SaveChangesAsync();   // make sure change persists

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var selfLink = $"{baseUrl}{invoice.BlobUrl}";  // full URL for response

            var response = new UploadInvoiceResponse
            {
                InvoiceId = invoice.Id,
                Status = invoice.Status,
                BlobUrl = selfLink,          // absolute for ResultPage
                FailureReason = invoice.ExceptionRecords?.FirstOrDefault()?.Reason
            };

            return Ok(response);
        }
        catch (DuplicateInvoiceException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /* ----------------------  DOWNLOAD  ---------------------- */
    [HttpGet("file/{fileName}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Download(string fileName)
    {
        var decoded = Uri.UnescapeDataString(fileName);

        try
        {
            var stream = await _blobStorage.DownloadAsync(decoded);
            Response.Headers.ContentDisposition = $"inline; filename=\"{decoded}\"";
            return File(stream, "application/pdf");
        }
        catch (FileNotFoundException)
        {
            return NotFound($"File {decoded} not found");
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
