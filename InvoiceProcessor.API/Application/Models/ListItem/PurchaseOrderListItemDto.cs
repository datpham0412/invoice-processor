using InvoiceProcessor.API.Domain.Enums;

namespace InvoiceProcessor.API.Application.Models.ListItem;

public record PurchaseOrderListItemDto(
    Guid     Id,
    string   PoNumber,
    string   VendorName,
    decimal  TotalAmount,
    DateTime IssueDate,
    IReadOnlyList<POLineItemListDto> LineItems,
    InvoiceStatus Status
    );
