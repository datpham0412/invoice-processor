using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Application.Models.ListItem;
namespace InvoiceProcessor.API.Application.Interfaces;
public interface IPurchaseOrderRepository
{
    Task<PurchaseOrder?> GetByPoNumberAsync(string poNumber, string userId);
    Task<PurchaseOrder?> GetByIdAsync(Guid id, string userId);
    Task<PurchaseOrder?> GetByPoAndVendorAsync(string invoiceNumber, string vendorName, string userId);
    Task<PurchaseOrder?> GetByInvoiceNumberOnlyAsync(string invoiceNumber, string userId);
    Task<List<PurchaseOrder>> GetAllAsync(string userId);
    Task<List<PurchaseOrderListItemDto>> GetAllByUserAsync(string userId);
    Task AddAsync(PurchaseOrder purchaseOrder);
    Task UpdateAsync(PurchaseOrder purchaseOrder);
    Task DeleteAsync(Guid id, string userId);
    Task SaveChangesAsync();
}

// This interface defines the contract for a repository that manages PurchaseOrder entities.
// It includes methods for retrieving, adding, updating, and deleting purchase orders,