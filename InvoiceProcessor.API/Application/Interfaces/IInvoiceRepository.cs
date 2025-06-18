using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Application.Models.ListItem;
namespace InvoiceProcessor.API.Application.Interfaces;
public interface IInvoiceRepository
{
    Task<Invoice?> GetByIdAsync(Guid id, string userId);
    Task<List<Invoice>> GetAllAsync(string userId);
    Task<List<InvoiceListItemDto>> GetAllByUserAsync(string userId);
    Task AddAsync(Invoice invoice);
    Task UpdateAsync(Invoice invoice);
    Task DeleteAsync(Guid id, string userId);
    Task SaveChangesAsync();
}
// This interface defines the contract for a repository that manages Invoice entities.
// It includes methods for retrieving, adding, updating, and deleting invoices,
// as well as saving changes to the underlying data store. The methods are asynchronous,