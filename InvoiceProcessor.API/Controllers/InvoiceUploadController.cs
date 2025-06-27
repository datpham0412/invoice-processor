using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InvoiceProcessor.API.Application.Services;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Domain.Enums;
using InvoiceProcessor.API.Domain.Exceptions;
using InvoiceProcessor.API.Infrastructure.Persistence;
using System.Security.Claims;

namespace InvoiceProcessor.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/invoices")]
    [Produces("application/json")]
    public class InvoiceUploadController : ControllerBase
    {
        private readonly UploadInvoiceService _uploadService;
        private readonly MatchingService _matchingService;
        private readonly IBlobStorage _blobStorage;
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly AppDbContext _ctx;

        public InvoiceUploadController(
            UploadInvoiceService uploadService,
            MatchingService matchingService,
            IBlobStorage blobStorage,
            IInvoiceRepository invoiceRepository,
            AppDbContext ctx)
        {
            _uploadService = uploadService;
            _matchingService = matchingService;
            _blobStorage = blobStorage;
            _invoiceRepository = invoiceRepository;
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
                // Process upload only (no matching)
                var invoice = await _uploadService.ProcessUploadAsync(stream, file.FileName, userId);

                // Convert absolute blob path into relative download URL
                var fileName = Path.GetFileName(invoice.BlobUrl);
                var safeName = Uri.EscapeDataString(fileName);
                invoice.BlobUrl = $"/api/invoices/file/{safeName}";
                await _ctx.SaveChangesAsync();

                var baseUrl = $"{Request.Scheme}://{Request.Host}";
                var selfLink = $"{baseUrl}{invoice.BlobUrl}";

                var response = new UploadInvoiceResponse
                {
                    InvoiceId = invoice.Id,
                    Status = invoice.Status,
                    BlobUrl = selfLink,
                    FailureReason = null
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
                return NotFound(new { message = $"File {decoded} not found" });
            }
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
