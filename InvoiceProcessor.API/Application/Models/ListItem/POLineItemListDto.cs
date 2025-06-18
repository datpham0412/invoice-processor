namespace InvoiceProcessor.API.Application.Models.ListItem;

public record POLineItemListDto(
    Guid     Id,
    string   Description,
    decimal  Quantity,
    decimal  UnitPrice,
    decimal  Amount);