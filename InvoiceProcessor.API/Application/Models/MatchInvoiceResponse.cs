using InvoiceProcessor.API.Domain.Enums;

namespace InvoiceProcessor.API.Application.Models
{   
    public class MatchInvoiceResponse
    {
        // Invoice metadata
        public Guid   InvoiceId     { get; set; }
        public string InvoiceNumber { get; set; } = default!;
        public string VendorName    { get; set; } = default!;
        public decimal TotalAmount  { get; set; }
        public DateTime InvoiceDate { get; set; }

        public string Filename      { get; set; } = default!;  // e.g. "invoice_001.pdf"
        public string BlobUrl       { get; set; } = default!;  // download/preview URL
        public DateTime UploadedAt  { get; set; }             // when it was first saved

        // OCR processing time
        public string ProcessingTime { get; set; } = default!; // e.g. "1.2s"

        // Matching outcome
        public bool          IsMatched      { get; set; }
        public InvoiceStatus Status         { get; set; }
        public string?       FailureReason  { get; set; }

        // Details of the match
        public string? MatchedPO       { get; set; }
        public int?   MatchConfidence { get; set; }  // optional percentage

        // The raw data extracted by OCR
        public ExtractedInvoiceDto ExtractedData { get; set; } = new();

        // Summary of which fields matched or not
        public MatchingDetailsDto MatchingDetails { get; set; } = new();

        // All exception records logged during matching
        public List<ExceptionRecordDto> ExceptionRecords { get; set; } = new();
    }

    public class ExtractedInvoiceDto
    {
        public VendorDto Vendor   { get; set; } = new();
        public InvoiceDto Invoice { get; set; } = new();
        public List<LineItemDto> LineItems { get; set; } = new();
    }

    public class VendorDto
    {
        public string Name    { get; set; } = default!;
    }

    public class InvoiceDto
    {
        public string Number   { get; set; } = default!;
        public DateTime Date    { get; set; }
    }

    public class LineItemDto
    {
        public Guid     Id          { get; set; }
        public string  Description { get; set; } = default!;
        public decimal Quantity    { get; set; }
        public decimal UnitPrice   { get; set; }
        public decimal Amount      { get; set; }
    }

    public class MatchingDetailsDto
    {
        public string MatchType      { get; set; } = default!;  // e.g. "Manual"
        public List<string> MatchedFields   { get; set; } = new();  // e.g. ["Vendor","Amount"]
        public List<string> Discrepancies   { get; set; } = new();  // e.g. ["Line items mismatch"]
    }

    public class ExceptionRecordDto
    {
        public string   Reason    { get; set; } = default!;
        public DateTime Timestamp { get; set; }
    }
}
