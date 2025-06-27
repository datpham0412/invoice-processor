using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Application.Models.PurchaseOrders;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Domain.Enums;

namespace InvoiceProcessor.API.Application.Services
{
    public class CreatePurchaseOrderService
    {
        private readonly IPurchaseOrderRepository _purchaseOrderRepository;

        public CreatePurchaseOrderService(IPurchaseOrderRepository purchaseOrderRepository)
        {
            _purchaseOrderRepository = purchaseOrderRepository;
        }

        private static PurchaseOrderResponse MapToResponse(PurchaseOrder po) => new()
        {
            Id = po.Id,
            PoNumber = po.PoNumber,
            VendorName = po.VendorName,
            IssueDate = po.IssueDate,
            TotalAmount = po.TotalAmount,
            LineItems = po.LineItems.Select(li => new PurchaseOrderLineItemResponse
            {
                Description = li.Description,
                Quantity = li.Quantity,
                UnitPrice = li.UnitPrice,
                Amount = li.Amount
            }).ToList(),
            Status = po.Status
        };

        public async Task<PurchaseOrderResponse?> GetByPoNumberAsync(string poNumber, string userId)
        {
            var po = await _purchaseOrderRepository.GetByPoNumberAsync(poNumber, userId);
            if (po == null) return null;

            return MapToResponse(po);
        }

        public async Task<PurchaseOrderResponse> CreateAsync(CreatePurchaseOrderRequest request, string userId)
        {
            var existing = await _purchaseOrderRepository.GetByPoNumberAsync(request.PoNumber, userId);
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
                }).ToList(),
                UserId = userId,
                Status = InvoiceStatus.Pending
            };

            await _purchaseOrderRepository.AddAsync(purchaseOrder);
            await _purchaseOrderRepository.SaveChangesAsync();

            return MapToResponse(purchaseOrder);
        }
    }
}
