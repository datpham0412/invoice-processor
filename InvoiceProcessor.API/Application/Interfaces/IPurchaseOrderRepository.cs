using InvoiceProcessor.API.Domain.Entities;
namespace InvoiceProcessor.API.Application.Interfaces;
public interface IPurchaseOrderRepository
{
    Task<PurchaseOrder?> GetByPoNumberAsync(string poNumber);
    Task<PurchaseOrder?> GetByPoNumberAsync(string invoiceNumber, string vendorName);
    Task<PurchaseOrder?> GetByInvoiceNumberOnlyAsync(string invoiceNumber);
    Task<List<PurchaseOrder>> GetAllAsync();
    Task AddAsync(PurchaseOrder purchaseOrder);
    Task UpdateAsync(PurchaseOrder purchaseOrder);
    Task DeleteAsync(Guid id);
    Task SaveChangesAsync();
}

// This interface defines the contract for a repository that manages PurchaseOrder entities.
// It includes methods for retrieving, adding, updating, and deleting purchase orders,