using System;
using System.Threading.Tasks;
using Xunit;
using Moq;
using InvoiceProcessor.API.Application.Services;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Domain.Enums;
using System.Collections.Generic;
using System.Linq;

namespace InvoiceProcessor.Tests
{
    public class MatchingServiceTests
    {
        private readonly Mock<IPurchaseOrderRepository> _poRepoMock = new();
        private readonly Mock<IInvoiceRepository> _invoiceRepoMock = new();
        private readonly Mock<IExceptionRecordRepository> _exceptionRepoMock = new();
        private readonly MatchingService _matchingService;

        public MatchingServiceTests()
        {
            _matchingService = new MatchingService(
                _poRepoMock.Object,
                _invoiceRepoMock.Object,
                _exceptionRepoMock.Object
            );
        }

        [Fact]
        public async Task MatchInvoiceAsync_ShouldMarkAsMatched_WhenTotalsMatch()
        {
            // Arrange
            var invoice = new Invoice
            {
                Id = Guid.NewGuid(),
                PoNumber = "PO-123",
                TotalAmount = 100
            };

            var lineItem = new POLineItem { Quantity = 2, UnitPrice = 50 };
            var po = new PurchaseOrder
            {
                Id = Guid.NewGuid(),
                PoNumber = "PO-123",
                LineItems = new List<POLineItem> { lineItem }
            };

            // Calculate the total amount for the PO
            lineItem.Amount = lineItem.Quantity * lineItem.UnitPrice;
            po.TotalAmount = po.LineItems.Sum(li => li.Amount);

            _poRepoMock.Setup(repo => repo.GetByPoNumberAsync(invoice.PoNumber))
                       .ReturnsAsync(po);

            // Act
            var result = await _matchingService.MatchInvoiceAsync(invoice);

            // Assert
            Assert.True(result.IsMatched);
            Assert.Equal(InvoiceStatus.Matched, result.Status);
            Assert.Null(result.FailureReason);

            _invoiceRepoMock.Verify(r => r.UpdateAsync(invoice), Times.Once);
            _exceptionRepoMock.Verify(r => r.AddAsync(It.Is<ExceptionRecord>(
                er => er.Reason.Contains("successfully matched"))), Times.Once);
        }

        [Fact]
        public async Task MatchInvoiceAsync_ShouldLogException_WhenTotalsDoNotMatch()
        {
            // Arrange
            var invoice = new Invoice
            {
                Id = Guid.NewGuid(),
                PoNumber = "PO-123",
                TotalAmount = 200
            };

            var lineItem = new POLineItem { Quantity = 2, UnitPrice = 50 };
            var po = new PurchaseOrder
            {
                Id = Guid.NewGuid(),
                PoNumber = "PO-123",
                LineItems = new List<POLineItem> { lineItem }
            };

            // Calculate the total amount for the PO
            lineItem.Amount = lineItem.Quantity * lineItem.UnitPrice;
            po.TotalAmount = po.LineItems.Sum(li => li.Amount);

            _poRepoMock.Setup(repo => repo.GetByPoNumberAsync(invoice.PoNumber))
                    .ReturnsAsync(po);

            // Act
            var result = await _matchingService.MatchInvoiceAsync(invoice);

            // Assert
            Assert.False(result.IsMatched);
            Assert.Equal(InvoiceStatus.Discrepancy, result.Status);
            Assert.Contains("Total amount mismatch", result.FailureReason);

            _exceptionRepoMock.Verify(r => r.AddAsync(It.IsAny<ExceptionRecord>()), Times.Once);
            _invoiceRepoMock.Verify(r => r.UpdateAsync(It.IsAny<Invoice>()), Times.Once);
        }

        [Fact]
        public async Task MatchInvoiceAsync_ShouldReturnUnmatchedNoPO_WhenPoMissing()
        {
            // Arrange
            var invoice = new Invoice
            {
                Id = Guid.NewGuid(),
                PoNumber = string.Empty,
                TotalAmount = 100
            };

            _poRepoMock.Setup(repo => repo.GetByPoNumberAsync(It.IsAny<string>()))
                       .ReturnsAsync((PurchaseOrder?)null);

            // Act
            var result = await _matchingService.MatchInvoiceAsync(invoice);

            // Assert
            Assert.False(result.IsMatched);
            Assert.Equal(InvoiceStatus.UnmatchedNoPO, result.Status);
            Assert.Contains("PO number missing", result.FailureReason);

            _invoiceRepoMock.Verify(r => r.UpdateAsync(invoice), Times.Once);   // status updated
            _exceptionRepoMock.Verify(r => r.AddAsync(It.IsAny<ExceptionRecord>()), Times.Once);
        }
    }
}
// This code is a unit test for the MatchingService class in the InvoiceProcessor application.