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

        public UploadInvoiceService(
            IBlobStorage blobStorage,
            IFormRecognizer formRecognizer,
            IInvoiceRepository invoiceRepository)
        {
            _blobStorage = blobStorage;
            _formRecognizer = formRecognizer;
            _invoiceRepository = invoiceRepository;
        }

        public async Task<Invoice> ProcessUploadAsync(Stream pdfStream, string fileName, string userId)
        {
            using (pdfStream)
            {
                // Upload PDF to blob storage
                var blobUrl = await _blobStorage.UploadAsync(pdfStream, fileName);
                pdfStream.Position = 0;

                // Extract invoice data via OCR
                var invoice = await _formRecognizer.ExtractInvoiceDataAsync(pdfStream);
                if (string.IsNullOrWhiteSpace(invoice.InvoiceNumber) &&
                    string.IsNullOrWhiteSpace(invoice.VendorName) &&
                    invoice.TotalAmount <= 0)
                {
                    throw new InvalidOperationException("OCR failed to extract invoice details. Invoice not saved.");
                }

                // Initialize invoice entity
                invoice.BlobUrl = blobUrl;
                invoice.UserId = userId;
                invoice.Status = Domain.Enums.InvoiceStatus.Pending;

                // Persist invoice without matching
                await _invoiceRepository.AddAsync(invoice);
                await _invoiceRepository.SaveChangesAsync();

                return invoice;
            }
        }
    }
}
