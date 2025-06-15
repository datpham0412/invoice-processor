using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using InvoiceProcessor.API.Application.Models.PurchaseOrders;
using InvoiceProcessor.API.Application.Services;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Domain.Entities;
using Moq;
using Xunit;

public class CreatePurchaseOrderServiceTests
{
    private readonly Mock<IPurchaseOrderRepository> _poRepoMock = new();
    private readonly CreatePurchaseOrderService _service;

    public CreatePurchaseOrderServiceTests()
    {
        _service = new CreatePurchaseOrderService(_poRepoMock.Object);
    }

    [Fact]
    public async Task CreateAsync_ShouldSaveAndReturnPurchaseOrder_WhenRequestIsValid()
    {
        var request = new CreatePurchaseOrderRequest
        {
            PoNumber = "PO-001",
            VendorName = "Coles",
            IssueDate = new DateTime(2025, 6, 15),
            LineItems = new List<PurchaseOrderLineItemDto>
            {
                new() { Description = "Milk",  Quantity = 2, UnitPrice = 3.50m },
                new() { Description = "Eggs",  Quantity = 1, UnitPrice = 4.00m }
            }
        };

        _poRepoMock.Setup(r => r.GetByPoNumberAsync("PO-001"))
                   .ReturnsAsync((PurchaseOrder?)null);
        _poRepoMock
            .Setup(r => r.AddAsync(It.IsAny<PurchaseOrder>()))
            .Callback<PurchaseOrder>(po =>
            {
                foreach (var item in po.LineItems)
                    item.Amount = item.Quantity * item.UnitPrice;

                po.TotalAmount = po.LineItems.Sum(li => li.Amount);
            });

        var response = await _service.CreateAsync(request);

        Assert.Equal(request.PoNumber, response.PoNumber);
        Assert.Equal(11.00m, response.TotalAmount);   

        _poRepoMock.Verify(r => r.AddAsync(It.IsAny<PurchaseOrder>()), Times.Once);
        _poRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_ShouldThrow_WhenPoNumberAlreadyExists()
    {
        var existingPo = new PurchaseOrder { PoNumber = "PO-001" };
        _poRepoMock.Setup(r => r.GetByPoNumberAsync("PO-001"))
                   .ReturnsAsync(existingPo);
        

        var request = new CreatePurchaseOrderRequest
        {
            PoNumber = "PO-001",
            VendorName = "Coles",
            IssueDate = DateTime.UtcNow
        };

        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CreateAsync(request));
        _poRepoMock.Verify(r => r.AddAsync(It.IsAny<PurchaseOrder>()), Times.Never);
    }
}
