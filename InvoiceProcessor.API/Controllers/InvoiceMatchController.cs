using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InvoiceProcessor.API.Application.Services;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Application.Models;
using System.Security.Claims;

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
        public async Task<ActionResult<MatchResult>> Match(Guid invoiceId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var invoice = await _invoiceRepo.GetByIdAsync(invoiceId, userId);
            if (invoice == null)
                return NotFound(new { message = "Invoice not found." });

            var result = await _matchingService.MatchInvoiceAsync(invoice);
            return Ok(result);
        }
    }
}
