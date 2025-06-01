using InvoiceProcessor.API.Domain.Enums;
namespace InvoiceProcessor.API.Domain.Entities
{
    public class Invoice
    {
        public Guid Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public string VendorName { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public decimal TotalAmount { get; set; }
        public InvoiceStatus Status { get; set; }
        public List<LineItem> LineItems { get; set; } = new();
        public string BlobUrl {get; set; } = string.Empty;
        public decimal CalculateTotal() => LineItems.Sum(x => x.Amount);
    }
}
