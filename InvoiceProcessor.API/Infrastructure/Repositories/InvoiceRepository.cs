using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Infrastructure.Persistence;
using InvoiceProcessor.API.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;
using InvoiceProcessor.API.Application.Models.ListItem;

namespace InvoiceProcessor.API.Infrastructure.Repositories{
    public class InvoiceRepository : IInvoiceRepository{
        private readonly AppDbContext _context;

        public InvoiceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Invoice?> GetByIdAsync(Guid id, string userId)
        {
            return await _context.Invoices!
            .Include(i => i.LineItems)
            .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        }

        public async Task<List<Invoice>> GetAllAsync(string userId)
        {
            return await _context.Invoices!
                .Include(i => i.LineItems)
                .Where(i => i.UserId == userId)
                .ToListAsync();
        }
        public async Task<List<InvoiceListItemDto>> GetAllByUserAsync(string userId)
        {
            return await _context.Invoices!
                .Include(i => i.LineItems)
                .Where(i => i.UserId == userId)
                .OrderByDescending(i => i.InvoiceDate)
                .Select(i => new InvoiceListItemDto(i.Id, i.InvoiceNumber, i.VendorName, i.TotalAmount, i.InvoiceDate, i.Status, i.LineItems.Select(li => new LineItemListDto(li.Id, li.Description, li.Quantity, li.UnitPrice, li.Amount)).ToList(), i.BlobUrl))
                .ToListAsync();
        }
        public async Task AddAsync(Invoice invoice)
        {
            bool exists = await _context.Invoices!
            .AnyAsync(i => 
                i.InvoiceNumber == invoice.InvoiceNumber &&
                i.UserId == invoice.UserId &&
                i.VendorName == invoice.VendorName);
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

        public async Task DeleteAsync(Guid id, string userId)
        {
            var invoice = await _context.Invoices!.FindAsync(id);
            if (invoice != null)
            {
                _context.Invoices!.Remove(invoice);
                await _context.SaveChangesAsync();
            }
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}