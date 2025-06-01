using System;
namespace InvoiceProcessor.API.Domain.Entities
{
    public class POLineItem
    {
        public Guid Id { get; set; }
        public Guid PurchaseOrderId { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Amount => Quantity * UnitPrice;
        public virtual PurchaseOrder PurchaseOrder { get; set; } = new();
    }
}
