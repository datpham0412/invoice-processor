using InvoiceProcessor.API.Domain.Entities;
namespace InvoiceProcessor.API.Application.Interfaces;
public interface IPurchaseOrderRepository
{
    Task<PurchaseOrder?> GetByPoNumberAsync(string poNumber, string userId);
    Task<PurchaseOrder?> GetByPoAndVendorAsync(string invoiceNumber, string vendorName, string userId);
    Task<PurchaseOrder?> GetByInvoiceNumberOnlyAsync(string invoiceNumber, string userId);
    Task<List<PurchaseOrder>> GetAllAsync(string userId);
    Task AddAsync(PurchaseOrder purchaseOrder);
    Task UpdateAsync(PurchaseOrder purchaseOrder);
    Task DeleteAsync(Guid id, string userId);
    Task SaveChangesAsync();
}

// This interface defines the contract for a repository that manages PurchaseOrder entities.
// It includes methods for retrieving, adding, updating, and deleting purchase orders,