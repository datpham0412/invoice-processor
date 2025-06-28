using InvoiceProcessor.API.Application.Models.ListItem;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Domain.Enums;

namespace InvoiceProcessor.API.Application.Models.Detail
{
    public record InvoiceDetailDto(
        Guid     Id,
        string   InvoiceNumber,
        string?  PoNumber,
        string   VendorName,
        decimal  TotalAmount,
        DateTime InvoiceDate,
        InvoiceStatus Status,

        // new matching fields
        bool?               IsMatched,
        int?                MatchConfidence,
        string?             MatchType,
        string?             FailureReason,
        IReadOnlyList<string>?      MatchedFields,
        IReadOnlyList<string>?      Discrepancies,
        IReadOnlyList<ExceptionRecord>? ExceptionRecords,

        string? ProcessingTime,

        string  BlobUrl,
        string  Filename,
        DateTime CreatedAt,
        IReadOnlyList<LineItemListDto> LineItems
    );
}
