using InvoiceProcessor.API.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace InvoiceProcessor.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceRepository _invoiceRepository;

        public InvoiceController(IInvoiceRepository invoiceRepository)
        {
            _invoiceRepository = invoiceRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var invoices = await _invoiceRepository.GetAllAsync();
            return Ok(invoices);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(id);
            if (invoice == null)
                return NotFound();

            return Ok(invoice);
        }
    }
}
