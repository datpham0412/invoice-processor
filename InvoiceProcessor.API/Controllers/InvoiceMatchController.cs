using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InvoiceProcessor.API.Application.Services;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Application.Models;
using System.Security.Claims;
using InvoiceProcessor.API.Domain.Enums;

namespace InvoiceProcessor.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/invoices")]
    [Produces("application/json")]
    public class InvoiceMatchController : ControllerBase
    {
        private readonly MatchingService     _matchingService;
        private readonly IInvoiceRepository  _invoiceRepo;

        public InvoiceMatchController(
            MatchingService matchingService,
            IInvoiceRepository invoiceRepo)
        {
            _matchingService = matchingService;
            _invoiceRepo     = invoiceRepo;
        }

        /// <summary>
        /// Trigger matching on an already-uploaded invoice.
        /// </summary>
        [HttpPost("{invoiceId:guid}/match")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<MatchInvoiceResponse>> Match(Guid invoiceId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // 1. Load the invoice (with OCR timestamps already set)
            var invoice = await _invoiceRepo.GetByIdAsync(invoiceId, userId);
            if (invoice == null)
                return NotFound(new { message = "Invoice not found." });

            // 2. Perform matching
            var matchResult = await _matchingService.MatchInvoiceAsync(invoice);

            // 3. Calculate OCR processing time
            var duration = invoice.ExtractionDuration ?? TimeSpan.Zero;
            var processingTime = $"{duration.TotalSeconds:F1}s";
            
            var totalChecks    = matchResult.MatchedFields.Count + matchResult.Discrepancies.Count;
            var confidence     = totalChecks > 0
                                 ? (int)(matchResult.MatchedFields.Count * 100.0 / totalChecks)
                                 : 0;
            
            var safeName    = Uri.EscapeDataString(invoice.Filename);
            var relativeUrl = $"/api/invoices/file/{safeName}";
            var absoluteUrl = $"{Request.Scheme}://{Request.Host}{relativeUrl}";

            // Determine matchType
            string matchType;
            if (matchResult.IsMatched)
            {
                matchType = "Exact Match";
            }
            else if (matchResult.MatchedFields.Count > 0)
            {
                matchType = "Partial Match";
            }
            else
            {
                matchType = "No Match";
            }

            // 4. Build and return your API response
            var response = new MatchInvoiceResponse
            {
                // OCR timing
                ProcessingTime = processingTime,

                // Invoice metadata
                InvoiceId = invoice.Id,
                InvoiceNumber = invoice.InvoiceNumber,
                VendorName = invoice.VendorName,
                TotalAmount = invoice.TotalAmount,
                InvoiceDate = invoice.InvoiceDate,
                Filename = invoice.Filename,
                BlobUrl = absoluteUrl,
                UploadedAt = invoice.CreatedAt,

                // Matching outcome
                IsMatched = matchResult.IsMatched,
                Status = matchResult.Status,
                FailureReason = matchResult.FailureReason,
                MatchedPO = invoice.PoNumber,
                MatchConfidence = confidence,

                // Extracted data
                ExtractedData = new ExtractedInvoiceDto
                {
                    Vendor = new VendorDto
                    {
                        Name = invoice.VendorName
                    },
                    Invoice = new InvoiceDto
                    {
                        Number = invoice.InvoiceNumber,
                        Date = invoice.InvoiceDate
                    },
                    LineItems = invoice.LineItems.Select(li => new LineItemDto
                    {
                        Id = li.Id,
                        Description = li.Description,
                        Quantity = li.Quantity,
                        UnitPrice = li.UnitPrice,
                        Amount = li.Amount
                    }).ToList()
                },

                // Exception records
                ExceptionRecords = invoice.ExceptionRecords.Select(er => new ExceptionRecordDto
                {
                    Reason = er.Reason,
                    Timestamp = er.Timestamp
                }).ToList(),

                // Matching details
                MatchingDetails = new MatchingDetailsDto
                {
                    MatchType      = matchType,
                    MatchedFields = matchResult.MatchedFields,
                    Discrepancies = matchResult.Discrepancies
                }
            };

            return Ok(response);
        }
    }
}
