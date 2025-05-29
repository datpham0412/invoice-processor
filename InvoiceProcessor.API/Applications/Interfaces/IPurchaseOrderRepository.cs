using InvoiceProcessor.Domain.Entities;

public interface IPurchaseOrderRepository
{
    Task<PurchaseOrder?> GetByPoNumberAsync(string poNumber);
    Task<List<PurchaseOrder>> GetAllAsync();
    Task AddAsync(PurchaseOrder purchaseOrder);
    Task UpdateAsync(PurchaseOrder purchaseOrder);
    Task DeleteAsync(Guid id);
    Task SaveChangesAsync();
}

// This interface defines the contract for a repository that manages PurchaseOrder entities.
// It includes methods for retrieving, adding, updating, and deleting purchase orders,