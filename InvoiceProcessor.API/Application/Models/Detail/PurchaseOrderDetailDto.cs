using InvoiceProcessor.API.Application.Models.ListItem;

namespace InvoiceProcessor.API.Application.Models.Detail
{
    public record PurchaseOrderDetailDto(
        Guid Id,
        string PoNumber,
        string VendorName,
        decimal TotalAmount,
        DateTime IssueDate,
        DateTime CreatedAt,
        string Status,
        IReadOnlyList<POLineItemListDto> LineItems,
        IReadOnlyList<MatchedInvoiceDto> MatchedInvoices
    );

    public record MatchedInvoiceDto(
        Guid Id,
        string InvoiceNumber,
        decimal Amount,
        DateTime MatchDate,
        string Status,
        int Confidence
    );
}
