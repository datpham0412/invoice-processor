using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
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

        public string BlobUrl { get; set; } = string.Empty;
        public string Filename { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public DateTime? ExtractionStartedAt { get; set; }
        public DateTime? ExtractionCompletedAt { get; set; }

        [NotMapped]
        public TimeSpan? ExtractionDuration => ExtractionCompletedAt - ExtractionStartedAt;

        // --- New match-result persistence fields ---
        public bool? IsMatched { get; set; }
        public int? MatchConfidence { get; set; }
        public string? MatchType { get; set; }
        public string? FailureReason { get; set; }

        // JSON columns
        public string? MatchedFieldsJson { get; set; }
        public string? DiscrepanciesJson { get; set; }
        public string? ExceptionRecordsJson { get; set; }

        // NotMapped helpers to deserialize
        [NotMapped]
        public List<string> MatchedFields
            => MatchedFieldsJson is null
               ? new()
               : JsonSerializer.Deserialize<List<string>>(MatchedFieldsJson)!;

        [NotMapped]
        public List<string> Discrepancies
            => DiscrepanciesJson is null
               ? new()
               : JsonSerializer.Deserialize<List<string>>(DiscrepanciesJson)!;

        [NotMapped]
        public List<ExceptionRecord> ExceptionRecordsList
            => ExceptionRecordsJson is null
               ? new()
               : JsonSerializer.Deserialize<List<ExceptionRecord>>(ExceptionRecordsJson)!;

        // legacy property left for compatibility, you can remove if you migrate off it
        [NotMapped]
        public List<ExceptionRecord> ExceptionRecords { get; set; } = new();

        public string UserId { get; set; } = default!;
        public AppUser User { get; set; } = default!;

        public decimal CalculateTotal() => LineItems.Sum(x => x.Amount);
    }
}
