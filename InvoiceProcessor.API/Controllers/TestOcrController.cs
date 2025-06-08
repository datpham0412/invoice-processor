using InvoiceProcessor.API.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InvoiceProcessor.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestOcrController : ControllerBase
    {
        private readonly IFormRecognizer _formRecognizer;

        public TestOcrController(IFormRecognizer formRecognizer)
        {
            _formRecognizer = formRecognizer;
        }

        [HttpPost("analyze")]
        [Consumes("multipart/form-data")] // 👈 required for Swagger UI to render upload
        public async Task<IActionResult> AnalyzeInvoice(IFormFile file) // 👈 DO NOT use [FromForm] here
        {
            if (file == null || file.Length == 0)
                return BadRequest("Please upload a valid PDF file.");

            using var stream = file.OpenReadStream();
            var invoice = await _formRecognizer.ExtractInvoiceDataAsync(stream);

            return Ok(invoice);
        }
    }
}
