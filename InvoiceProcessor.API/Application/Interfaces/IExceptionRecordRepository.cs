using InvoiceProcessor.Domain.Entities;

namespace InvoiceProcessor.Application.Interfaces;


public interface IExceptionRecordRepository
{
    Task AddAsync(ExceptionRecord exception);
    Task<List<ExceptionRecord>> GetAllAsync();
    Task SaveChangesAsync();
}

