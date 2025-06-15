using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Application.Models.PurchaseOrders;
using InvoiceProcessor.API.Domain.Entities;

namespace InvoiceProcessor.API.Application.Services
{
    public class CreatePurchaseOrderService
    {
        private readonly IPurchaseOrderRepository _purchaseOrderRepository;

        public CreatePurchaseOrderService(IPurchaseOrderRepository purchaseOrderRepository)
        {
            _purchaseOrderRepository = purchaseOrderRepository;
        }

        public async Task<PurchaseOrderResponse> CreateAsync(CreatePurchaseOrderRequest request)
        {
            var existing = await _purchaseOrderRepository.GetByPoNumberAsync(request.PoNumber);
            if (existing != null)
            {
                throw new InvalidOperationException($"PO number '{request.PoNumber}' already exists.");
            }

            var purchaseOrder = new PurchaseOrder
            {
                Id = Guid.NewGuid(),
                PoNumber = request.PoNumber,
                VendorName = request.VendorName,
                IssueDate = request.IssueDate,
                LineItems = request.LineItems.Select(li => new POLineItem
                {
                    Id = Guid.NewGuid(),
                    Description = li.Description,
                    Quantity = li.Quantity,
                    UnitPrice = li.UnitPrice
                }).ToList()
            };

            await _purchaseOrderRepository.AddAsync(purchaseOrder);
            await _purchaseOrderRepository.SaveChangesAsync();

            return new PurchaseOrderResponse
            {
                Id = purchaseOrder.Id,
                PoNumber = purchaseOrder.PoNumber,
                VendorName = purchaseOrder.VendorName,
                IssueDate = purchaseOrder.IssueDate,
                TotalAmount = purchaseOrder.TotalAmount,
                LineItems = purchaseOrder.LineItems.Select(li => new PurchaseOrderLineItemResponse
                {
                    Description = li.Description,
                    Quantity = li.Quantity,
                    UnitPrice = li.UnitPrice,
                    Amount = li.Amount
                }).ToList()
            };
        }
    }
}
