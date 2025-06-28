using InvoiceProcessor.API.Domain.Entities;
namespace InvoiceProcessor.API.Application.Interfaces;

public interface IExceptionRecordRepository
{
    Task AddAsync(ExceptionRecord exception);
    Task<List<ExceptionRecord>> GetAllAsync();
    Task SaveChangesAsync();
    Task<List<ExceptionRecord>> GetByInvoiceIdAsync(Guid invoiceId);
}

