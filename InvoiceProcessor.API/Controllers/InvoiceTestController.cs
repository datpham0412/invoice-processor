using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InvoiceProcessor.API.Application.Services;   // <- UploadInvoiceService
using InvoiceProcessor.API.Application.Models;    // <- MatchResult DTO
using InvoiceProcessor.API.Domain.Enums;
using InvoiceProcessor.API.Domain.Entities;

namespace InvoiceProcessor.API.Controllers;

[ApiController]
[Route("api/invoices")]
public class InvoiceUploadController : ControllerBase
{
    private readonly UploadInvoiceService _uploadService;

    public InvoiceUploadController(UploadInvoiceService uploadService)
    {
        _uploadService = uploadService;
    }

    /// <summary>Uploads a PDF and returns both the Invoice and the MatchResult.</summary>
    /// <remarks>Consumes multipart/form-data so you can test in Swagger UI.</remarks>
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<UploadInvoiceResponse>> Upload(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest("Please upload a non-empty PDF.");

        await using var stream = file.OpenReadStream();
        var invoice = await _uploadService.ProcessUploadAsync(stream, file.FileName);

        // Build a lightweight response (so you don’t expose entire entity graph)
        var response = new UploadInvoiceResponse
        {
            InvoiceId     = invoice.Id,
            Status        = invoice.Status,
            BlobUrl       = invoice.BlobUrl,
            FailureReason = invoice.Status == InvoiceStatus.Discrepancy
                                ? invoice.ExceptionRecords.FirstOrDefault()?.Reason
                                : null
        };

        return Ok(response);
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
