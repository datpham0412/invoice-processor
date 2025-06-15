using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Application.Models.PurchaseOrders;
using InvoiceProcessor.API.Application.Services;
using InvoiceProcessor.API.Domain.Entities;
using Moq;
using Xunit;

public class CreatePurchaseOrderServiceTests
{
    private readonly Mock<IPurchaseOrderRepository> _poRepoMock = new();
    private readonly CreatePurchaseOrderService     _service;

    public CreatePurchaseOrderServiceTests()
    {
        _service = new CreatePurchaseOrderService(_poRepoMock.Object);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 1.  Happy-path create
    // ──────────────────────────────────────────────────────────────────────────
    [Fact]
    public async Task CreateAsync_ShouldSaveAndReturnPurchaseOrder_WhenRequestIsValid()
    {
        // Arrange
        var request = new CreatePurchaseOrderRequest
        {
            PoNumber   = "PO-001",
            VendorName = "Coles",
            IssueDate  = new DateTime(2025, 6, 15),
            LineItems  = new List<PurchaseOrderLineItemDto>
            {
                new() { Description = "Milk", Quantity = 2, UnitPrice = 3.50m },
                new() { Description = "Eggs", Quantity = 1, UnitPrice = 4.00m }
            }
        };

        _poRepoMock.Setup(r => r.GetByPoNumberAsync("PO-001"))
                   .ReturnsAsync((PurchaseOrder?)null);

        // mimic repo’s total calculation side-effect
        _poRepoMock.Setup(r => r.AddAsync(It.IsAny<PurchaseOrder>()))
                   .Callback<PurchaseOrder>(po =>
                   {
                       foreach (var li in po.LineItems)
                           li.Amount = li.Quantity * li.UnitPrice;

                       po.TotalAmount = po.LineItems.Sum(li => li.Amount);
                   });

        // Act
        var response = await _service.CreateAsync(request);

        // Assert
        Assert.Equal("PO-001", response.PoNumber);
        Assert.Equal(11.00m,  response.TotalAmount); // (2×3.5)+(1×4)

        _poRepoMock.Verify(r => r.AddAsync(It.IsAny<PurchaseOrder>()), Times.Once);
        _poRepoMock.Verify(r => r.SaveChangesAsync(),                 Times.Once);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2.  Duplicate PO number
    // ──────────────────────────────────────────────────────────────────────────
    [Fact]
    public async Task CreateAsync_ShouldThrow_WhenPoNumberAlreadyExists()
    {
        _poRepoMock.Setup(r => r.GetByPoNumberAsync("PO-001"))
                   .ReturnsAsync(new PurchaseOrder { PoNumber = "PO-001" });

        var request = new CreatePurchaseOrderRequest
        {
            PoNumber   = "PO-001",
            VendorName = "Coles",
            IssueDate  = DateTime.UtcNow
        };

        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CreateAsync(request));

        _poRepoMock.Verify(r => r.AddAsync(It.IsAny<PurchaseOrder>()), Times.Never);
        _poRepoMock.Verify(r => r.SaveChangesAsync(),                 Times.Never);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3.  Get-by-PO-number (found)
    // ──────────────────────────────────────────────────────────────────────────
    [Fact]
    public async Task GetByPoNumberAsync_ShouldMapToResponse_WhenPoExists()
    {
        // Arrange
        var po = new PurchaseOrder
        {
            Id         = Guid.NewGuid(),
            PoNumber   = "PO-123",
            VendorName = "Woolworths",
            IssueDate  = new DateTime(2025, 7, 1),
            LineItems  = new List<POLineItem>
            {
                new() { Id = Guid.NewGuid(), Description = "Apples", Quantity = 3, UnitPrice = 2.0m, Amount = 6.0m }
            },
            TotalAmount = 6.0m
        };

        _poRepoMock.Setup(r => r.GetByPoNumberAsync("PO-123"))
                   .ReturnsAsync(po);

        // Act
        var response = await _service.GetByPoNumberAsync("PO-123");

        // Assert
        Assert.NotNull(response);
        Assert.Equal("PO-123",     response!.PoNumber);
        Assert.Equal(6.0m,         response.TotalAmount);
        Assert.Single(response.LineItems);
        Assert.Equal("Apples",     response.LineItems[0].Description);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4.  Get-by-PO-number (not found)
    // ──────────────────────────────────────────────────────────────────────────
    [Fact]
    public async Task GetByPoNumberAsync_ShouldReturnNull_WhenPoDoesNotExist()
    {
        _poRepoMock.Setup(r => r.GetByPoNumberAsync("MISSING"))
                   .ReturnsAsync((PurchaseOrder?)null);

        var result = await _service.GetByPoNumberAsync("MISSING");

        Assert.Null(result);
    }
}
