using System;
using System.IO;
using System.Threading.Tasks;
using Xunit;
using Moq;
using InvoiceProcessor.API.Application.Services;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Domain.Entities;
using System.Collections.Generic;

namespace InvoiceProcessor.Tests
{
    public class UploadInvoiceServiceTests
    {
        private readonly Mock<IBlobStorage> _blobStorageMock = new();
        private readonly Mock<IFormRecognizer> _formRecognizerMock = new();
        private readonly Mock<IInvoiceRepository> _invoiceRepoMock = new();
        private readonly Mock<IPurchaseOrderRepository> _poRepoMock = new();
        private readonly Mock<IExceptionRecordRepository> _exceptionRepoMock = new();

        private readonly UploadInvoiceService _uploadInvoiceService;

        public UploadInvoiceServiceTests()
        {
            var matchingService = new MatchingService(
                _poRepoMock.Object,
                _invoiceRepoMock.Object,
                _exceptionRepoMock.Object
            );

            _uploadInvoiceService = new UploadInvoiceService(
                _blobStorageMock.Object,
                _formRecognizerMock.Object,
                _invoiceRepoMock.Object,
                matchingService
            );
        }

        [Fact]
        public async Task ProcessUploadAsync_ShouldUploadFile_ExtractInvoice_SaveAndMatch()
        {
            var stream = new MemoryStream(new byte[] { 1, 2, 3 });
            var fileName = "test-invoice.pdf";
            var userId = "test-user";
            var expectedBlobUrl = "https://blob.storage/test-invoice.pdf";

            var extractedInvoice = new Invoice
            {
                Id = Guid.NewGuid(),
                InvoiceNumber = "INV-123",
                TotalAmount = 150,
                BlobUrl = string.Empty,
                UserId = userId
            };

            _blobStorageMock.Setup(b => b.UploadAsync(It.IsAny<Stream>(), fileName))
                            .ReturnsAsync(expectedBlobUrl);

            _formRecognizerMock.Setup(f => f.ExtractInvoiceDataAsync(It.IsAny<Stream>()))
                            .ReturnsAsync(extractedInvoice);

            var result = await _uploadInvoiceService.ProcessUploadAsync(stream, fileName, userId);

            Assert.NotNull(result);
            Assert.Equal(extractedInvoice.Id, result.Id);
            Assert.Equal("INV-123", result.InvoiceNumber);
            Assert.Equal(150, result.TotalAmount);
            Assert.Equal(expectedBlobUrl, result.BlobUrl);
            Assert.Equal(userId, result.UserId);

            _blobStorageMock.Verify(b => b.UploadAsync(It.IsAny<Stream>(), fileName), Times.Once);
            _formRecognizerMock.Verify(f => f.ExtractInvoiceDataAsync(It.IsAny<Stream>()), Times.Once);
            _invoiceRepoMock.Verify(r => r.AddAsync(extractedInvoice), Times.Once);
            _invoiceRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
    }
}
