using System.IO;
using System.Threading.Tasks;
using InvoiceProcessor.Domain.Entities;
using InvoiceProcessor.Application.Interfaces;

namespace InvoiceProcessor.Application.Services
{
    public class UploadInvoiceService
    {
        private readonly IBlobStorage _blobStorage;
        private readonly IFormRecognizer _formRecognizer;
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IExceptionRecordRepository _exceptionRecordRepository;
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
        public async Task<Guid> ProcessUploadAsync(Stream pdfStream, string fileName)
        {
            var blobUrl = await _blobStorage.UploadAsync(pdfStream, fileName);
            pdfStream.Position = 0;
            var invoice = await _formRecognizer.ExtractInvoiceDataAsync(pdfStream);
            invoice.BlobUrl = blobUrl;

            await _invoiceRepository.AddAsync(invoice);
            await _invoiceRepository.SaveChangesAsync();

            await _matchingService.MatchInvoiceAsync(invoice);

            return invoice.Id;

        }
    }
}
