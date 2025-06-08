using System;
namespace InvoiceProcessor.API.Domain.Entities
{
    public class LineItem
    {
        public Guid Id { get; set; }
        public Guid InvoiceId { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Amount { get; set; }
        public decimal CalculateAmount() => Quantity * UnitPrice;
    }
}
