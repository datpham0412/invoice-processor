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
            await _matchingService.MatchInvoiceAsync(invoice);

            // Assert
            Assert.Equal(InvoiceStatus.Matched, invoice.Status);
            _invoiceRepoMock.Verify(r => r.UpdateAsync(invoice), Times.Once);
            _invoiceRepoMock.Verify(r => r.SaveChangesAsync(), Times.Never);
            _exceptionRepoMock.Verify(r => r.AddAsync(It.IsAny<ExceptionRecord>()), Times.Never);
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
            await _matchingService.MatchInvoiceAsync(invoice);

            // Assert
            Assert.Equal(InvoiceStatus.Discrepancy, invoice.Status);
            _exceptionRepoMock.Verify(r => r.AddAsync(It.Is<ExceptionRecord>(
                e => e.InvoiceId == invoice.Id && e.Reason.Contains("Total amount mismatch"))), Times.Once);
            _invoiceRepoMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task MatchInvoiceAsync_ShouldLogException_WhenPurchaseOrderNotFound()
        {
            // Arrange
            var invoice = new Invoice
            {
                Id = Guid.NewGuid(),
                PoNumber = "PO-999",
                TotalAmount = 100
            };

            _poRepoMock.Setup(repo => repo.GetByPoNumberAsync(invoice.PoNumber))
                       .ReturnsAsync((PurchaseOrder?)null);

            // Act
            await _matchingService.MatchInvoiceAsync(invoice);

            // Assert
            _exceptionRepoMock.Verify(r => r.AddAsync(It.Is<ExceptionRecord>(
                e => e.InvoiceId == invoice.Id && e.Reason.Contains("No matching Purchase Order"))), Times.Once);
            _invoiceRepoMock.Verify(r => r.UpdateAsync(It.IsAny<Invoice>()), Times.Never);
        }
    }
}
// This code is a unit test for the MatchingService class in the InvoiceProcessor application.