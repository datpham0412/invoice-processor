using System;
using System.IO;
using System.Threading.Tasks;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Domain.Enums;

namespace InvoiceProcessor.API.Application.Services
{
    public class UploadInvoiceService
    {
        private readonly IBlobStorage        _blobStorage;
        private readonly IFormRecognizer     _formRecognizer;
        private readonly IInvoiceRepository  _invoiceRepository;

        public UploadInvoiceService(
            IBlobStorage blobStorage,
            IFormRecognizer formRecognizer,
            IInvoiceRepository invoiceRepository)
        {
            _blobStorage        = blobStorage;
            _formRecognizer     = formRecognizer;
            _invoiceRepository  = invoiceRepository;
        }

        public async Task<Invoice> ProcessUploadAsync(Stream pdfStream, string fileName, string userId)
        {
            // 0) Copy the incoming stream into a byte array buffer
            byte[] data;
            using (var bufferStream = new MemoryStream())
            {
                await pdfStream.CopyToAsync(bufferStream);
                data = bufferStream.ToArray();
            }

            // 1) Perform OCR on its own MemoryStream instance
            Invoice invoice;
            var extractionStart = DateTime.UtcNow;
            using (var ocrStream = new MemoryStream(data))
            {
                invoice = await _formRecognizer.ExtractInvoiceDataAsync(ocrStream);
            }
            invoice.ExtractionStartedAt   = extractionStart;
            invoice.ExtractionCompletedAt = DateTime.UtcNow;

            // 2) Validate OCR result
            if (string.IsNullOrWhiteSpace(invoice.InvoiceNumber) &&
                string.IsNullOrWhiteSpace(invoice.VendorName) &&
                invoice.TotalAmount <= 0)
            {
                throw new InvalidOperationException("OCR failed to extract invoice details.");
            }

            // 3) Upload PDF on a separate MemoryStream instance
            using (var uploadStream = new MemoryStream(data))
            {
                invoice.BlobUrl = await _blobStorage.UploadAsync(uploadStream, fileName);
            }

            // 4) Persist metadata
            invoice.UserId = userId;
            invoice.Status = InvoiceStatus.Pending;
            invoice.Filename = fileName;
            invoice.CreatedAt = DateTime.UtcNow;
            await _invoiceRepository.AddAsync(invoice);
            await _invoiceRepository.SaveChangesAsync();

            return invoice;
        }
    }
}
