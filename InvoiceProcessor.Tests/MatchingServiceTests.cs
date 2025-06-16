using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Application.Services;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Domain.Enums;
using Moq;
using Xunit;

namespace InvoiceProcessor.Tests
{
    public class MatchingServiceTests
    {
        private readonly Mock<IPurchaseOrderRepository>   _poRepo   = new();
        private readonly Mock<IInvoiceRepository>         _invRepo  = new();
        private readonly Mock<IExceptionRecordRepository> _excRepo  = new();
        private readonly MatchingService                  _service;

        public MatchingServiceTests()
        {
            _service = new MatchingService(
                _poRepo.Object,
                _invRepo.Object,
                _excRepo.Object);
        }

        // ──────────────────────────────────────────────────────────────
        // 1. Happy-path – PoNumber present & totals equal
        // ──────────────────────────────────────────────────────────────
        [Fact]
        public async Task MatchInvoiceAsync_TotalsMatch_ReturnsMatched()
        {
            // Arrange
            var invoice = new Invoice
            {
                Id         = Guid.NewGuid(),
                PoNumber   = "PO-123",
                VendorName = "Acme",
                TotalAmount= 100,
                UserId     = "userA"
            };

            var poLine = new POLineItem { Quantity = 2, UnitPrice = 50, Amount = 100 };
            var po     = new PurchaseOrder
            {
                Id         = Guid.NewGuid(),
                PoNumber   = "PO-123",
                VendorName = "Acme",
                LineItems  = new List<POLineItem> { poLine },
                TotalAmount= 100,
                UserId     = "userA"
            };

            _poRepo.Setup(r => r.GetByPoNumberAsync(invoice.PoNumber))
                   .ReturnsAsync(po);

            // Act
            var result = await _service.MatchInvoiceAsync(invoice);

            // Assert
            Assert.True(result.IsMatched);
            Assert.Equal(InvoiceStatus.Matched, result.Status);
            Assert.Null(result.FailureReason);

            _invRepo.Verify(r => r.UpdateAsync(invoice), Times.Once);
            _excRepo.Verify(r => r.AddAsync(It.Is<ExceptionRecord>(
                er => er.Reason.Contains("Invoice matched"))), Times.Once);
        }

        // ──────────────────────────────────────────────────────────────
        // 2. Totals differ → Discrepancy
        // ──────────────────────────────────────────────────────────────
        [Fact]
        public async Task MatchInvoiceAsync_TotalsMismatch_ReturnsDiscrepancy()
        {
            var invoice = new Invoice
            {
                Id         = Guid.NewGuid(),
                PoNumber   = "PO-123",
                VendorName = "Acme",
                TotalAmount= 200,
                UserId     = "userA"
            };

            var poLine = new POLineItem { Quantity = 2, UnitPrice = 50, Amount = 100 };
            var po = new PurchaseOrder
            {
                Id          = Guid.NewGuid(),
                PoNumber    = "PO-123",
                VendorName  = "Acme",
                LineItems   = new List<POLineItem> { poLine },
                TotalAmount = 100,
                UserId      = "userA"
            };

            _poRepo.Setup(r => r.GetByPoNumberAsync(invoice.PoNumber))
                   .ReturnsAsync(po);

            var result = await _service.MatchInvoiceAsync(invoice);

            Assert.False(result.IsMatched);
            Assert.Equal(InvoiceStatus.Discrepancy, result.Status);
            Assert.Contains("Total amount mismatch", result.FailureReason);

            _excRepo.Verify(r => r.AddAsync(It.IsAny<ExceptionRecord>()), Times.Once);
            _invRepo.Verify(r => r.UpdateAsync(invoice), Times.Once);
        }

        // ──────────────────────────────────────────────────────────────
        // 3. PoNumber missing & **no** fallback PO ⇒ UnmatchedNoPO
        // ──────────────────────────────────────────────────────────────
        [Fact]
        public async Task MatchInvoiceAsync_NoPoAndNoFallback_ReturnsUnmatchedNoPO()
        {
            var invoice = new Invoice
            {
                Id            = Guid.NewGuid(),
                PoNumber      = null,
                InvoiceNumber = "INV-900",
                VendorName    = "Acme",
                TotalAmount   = 80,
                UserId        = "userA"
            };

            _poRepo.Setup(r => r.GetByPoNumberAsync(
                               invoice.InvoiceNumber!, invoice.VendorName))
                   .ReturnsAsync((PurchaseOrder?)null);

            var result = await _service.MatchInvoiceAsync(invoice);

            Assert.False(result.IsMatched);
            Assert.Equal(InvoiceStatus.FallbackInvoiceNotFound, result.Status);
            Assert.Contains("no matching PO found", result.FailureReason, StringComparison.OrdinalIgnoreCase);

            _invRepo.Verify(r => r.UpdateAsync(invoice), Times.Once);
            _excRepo.Verify(r => r.AddAsync(It.IsAny<ExceptionRecord>()), Times.Once);
        }

        // ──────────────────────────────────────────────────────────────
        // 4. PoNumber missing but fallback PO found ⇒ MatchedByInvoiceNumber
        // ──────────────────────────────────────────────────────────────
        [Fact]
        public async Task MatchInvoiceAsync_FallbackMatch_ReturnsMatchedByInvoiceNumber()
        {
            var invoice = new Invoice
            {
                Id            = Guid.NewGuid(),
                PoNumber      = null,
                InvoiceNumber = "INV-900",
                VendorName    = "Acme",
                TotalAmount   = 60,
                UserId        = "userA"
            };

            var poLine = new POLineItem { Quantity = 3, UnitPrice = 20, Amount = 60 };
            var fallbackPo = new PurchaseOrder
            {
                Id          = Guid.NewGuid(),
                PoNumber    = "INV-900",   // vendor uses Invoice# as PO#
                VendorName  = "Acme",
                LineItems   = new List<POLineItem> { poLine },
                TotalAmount = 60,
                UserId      = "userA"
            };

            _poRepo.Setup(r => r.GetByPoNumberAsync(
                    invoice.InvoiceNumber!, invoice.VendorName))
                   .ReturnsAsync(fallbackPo);

            var result = await _service.MatchInvoiceAsync(invoice);

            Assert.True(result.IsMatched);
            Assert.Equal(InvoiceStatus.MatchedByInvoiceNumber, result.Status);
            Assert.Null(result.FailureReason);

            // Invoice.PoNumber should now be filled
            Assert.Equal("INV-900", invoice.PoNumber);

            _invRepo.Verify(r => r.UpdateAsync(invoice), Times.Once);
            _excRepo.Verify(r => r.AddAsync(It.IsAny<ExceptionRecord>()), Times.Once);
        }
    }
}
