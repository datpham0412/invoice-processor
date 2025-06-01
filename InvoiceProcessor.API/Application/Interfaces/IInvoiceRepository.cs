using InvoiceProcessor.API.Domain.Entities;
namespace InvoiceProcessor.API.Application.Interfaces;
public interface IInvoiceRepository
{
    Task<Invoice?> GetByIdAsync(Guid id);
    Task<List<Invoice>> GetAllAsync();
    Task AddAsync(Invoice invoice);
    Task UpdateAsync(Invoice invoice);
    Task DeleteAsync(Guid id);
    Task SaveChangesAsync();
}
// This interface defines the contract for a repository that manages Invoice entities.
// It includes methods for retrieving, adding, updating, and deleting invoices,
// as well as saving changes to the underlying data store. The methods are asynchronous,