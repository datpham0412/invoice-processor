using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Infrastructure.Persistence;
using InvoiceProcessor.API.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace InvoiceProcessor.API.Infrastructure.Repositories{
    public class InvoiceRepository : IInvoiceRepository{
        private readonly AppDbContext _context;

        public InvoiceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Invoice?> GetByIdAsync(Guid id)
        {
            return await _context.Invoices!
            .Include(i => i.LineItems)
            .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<List<Invoice>> GetAllAsync()
        {
            return await _context.Invoices!
                .Include(i => i.LineItems)
                .ToListAsync();
        }
        public async Task AddAsync(Invoice invoice)
        {
            bool exists = await _context.Invoices!
            .AnyAsync(i => i.VendorName == invoice.VendorName &&
                        i.InvoiceNumber == invoice.InvoiceNumber);
            if (exists)
            {
                throw new DuplicateInvoiceException(invoice.VendorName, invoice.InvoiceNumber);
            }

            await _context.Invoices!.AddAsync(invoice);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Invoice invoice)
        {
            _context.Invoices!.Update(invoice);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
                var invoice = await _context.Invoices!.FindAsync(id);
            if (invoice != null)
            {
                _context.Invoices!.Remove(invoice);
            }
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}