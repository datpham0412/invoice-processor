using System.IO;
using System.Threading.Tasks;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Application.Interfaces;
namespace InvoiceProcessor.API.Application.Services
{
    public class UploadInvoiceService
    {
        private readonly IBlobStorage _blobStorage;
        private readonly IFormRecognizer _formRecognizer;
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly MatchingService _matchingService;

        public UploadInvoiceService(
            IBlobStorage blobStorage,
            IFormRecognizer formRecognizer,
            IInvoiceRepository invoiceRepository,
            MatchingService matchingService)
        {
            _blobStorage = blobStorage;
            _formRecognizer = formRecognizer;
            _invoiceRepository = invoiceRepository;
            _matchingService = matchingService;
        }
        public async Task<Invoice> ProcessUploadAsync(Stream pdfStream, string fileName)
        {
            var blobUrl = await _blobStorage.UploadAsync(pdfStream, fileName);
            pdfStream.Position = 0;
            var invoice = await _formRecognizer.ExtractInvoiceDataAsync(pdfStream);
            invoice.BlobUrl = blobUrl;

            await _invoiceRepository.AddAsync(invoice);
            await _matchingService.MatchInvoiceAsync(invoice);
            await _invoiceRepository.SaveChangesAsync();

            return invoice;
        }
    }
}
