using InvoiceProcessor.API.Domain.Enums;
namespace InvoiceProcessor.API.Application.Models.ListItem;

public record InvoiceListItemDto(
    Guid     Id,
    string   InvoiceNumber,
    string   VendorName,
    decimal  TotalAmount,
    DateTime InvoiceDate,
    InvoiceStatus   Status,
    IReadOnlyList<LineItemListDto> LineItems,
    string BlobUrl
    );
