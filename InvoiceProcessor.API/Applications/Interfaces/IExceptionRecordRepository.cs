using InvoiceProcessor.Domain.Entities;

public interface IExceptionRecordRepository
{
    Task AddAsync(ExceptionRecord exception);
    Task<List<ExceptionRecord>> GetAllAsync();
    Task SaveChangesAsync();
}

