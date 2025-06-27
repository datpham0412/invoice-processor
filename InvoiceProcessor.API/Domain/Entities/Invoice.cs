using System.ComponentModel.DataAnnotations.Schema;
using InvoiceProcessor.API.Domain.Enums;
namespace InvoiceProcessor.API.Domain.Entities
{
    public class Invoice
    {
        public Guid Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public string? PoNumber { get; set; }
        public string VendorName { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public decimal TotalAmount { get; set; }
        public InvoiceStatus Status { get; set; }
        public List<LineItem> LineItems { get; set; } = new();
        public string BlobUrl {get; set; } = string.Empty;
        public string Filename { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<ExceptionRecord> ExceptionRecords { get; set; } = new();
        public string UserId { get; set; } = default!;
        public AppUser User { get; set; } = default!;
        public decimal CalculateTotal() => LineItems.Sum(x => x.Amount);
        public DateTime? ExtractionStartedAt { get; set; }
        public DateTime? ExtractionCompletedAt { get; set; }
        [NotMapped]
        public TimeSpan? ExtractionDuration => ExtractionCompletedAt - ExtractionStartedAt;
    }
}
