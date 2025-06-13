using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InvoiceProcessor.API.Infrastructure.Persistence{
    public class ExceptionRecordRepository : IExceptionRecordRepository{
        private readonly AppDbContext _context;
        public ExceptionRecordRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(ExceptionRecord exception){
            await _context.ExceptionRecords!.AddAsync(exception);
        }

        public async Task<List<ExceptionRecord>> GetAllAsync(){
            return await _context.ExceptionRecords!
                                 .Include(er => er.Invoice)   // eager-load invoice
                                 .OrderByDescending(er => er.Timestamp)
                                 .ToListAsync();
        }

        public async Task SaveChangesAsync(){
            await _context.SaveChangesAsync();
        }
    }
}