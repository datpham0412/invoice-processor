using System;

namespace Domain.Entities
{
    public class LineItem
    {
        public Guid Id { get; set; }
        public Guid InvoiceId { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Amount { get; set; }
        public Invoice Invoice { get; set; } = new();
        public decimal CalculateAmount() => Quantity * UnitPrice;
    }
}
