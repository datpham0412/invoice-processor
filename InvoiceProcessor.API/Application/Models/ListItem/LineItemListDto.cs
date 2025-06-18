namespace InvoiceProcessor.API.Application.Models.ListItem;

public record LineItemListDto(
    Guid     Id,
    string   Description,
    decimal  Quantity,
    decimal  UnitPrice,
    decimal  Amount);