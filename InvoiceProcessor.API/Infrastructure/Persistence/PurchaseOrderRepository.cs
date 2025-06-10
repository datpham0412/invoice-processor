using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InvoiceProcessor.API.Infrastructure.Persistence
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        private readonly AppDbContext _context;

        private static void CalculateTotals(PurchaseOrder purchaseOrder)
        {
            foreach (var item in purchaseOrder.LineItems)
            {
                item.Amount = item.Quantity * item.UnitPrice;
            }

            purchaseOrder.TotalAmount = purchaseOrder.LineItems.Sum(li => li.Amount);
        }

        public PurchaseOrderRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PurchaseOrder?> GetByPoNumberAsync(string poNumber)
        {
            return await _context.PurchaseOrders!
                .FirstOrDefaultAsync(po => po.PoNumber == poNumber);
        }

        public async Task<List<PurchaseOrder>> GetAllAsync()
        {
            return await _context.PurchaseOrders!.ToListAsync();
        }

        public async Task AddAsync(PurchaseOrder purchaseOrder)
        {
            CalculateTotals(purchaseOrder);
            await _context.PurchaseOrders!.AddAsync(purchaseOrder);
        }

        public async Task UpdateAsync(PurchaseOrder purchaseOrder)
        {
            _context.PurchaseOrders!.Update(purchaseOrder);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var po = await _context.PurchaseOrders!.FindAsync(id);
            if (po != null)
            {
                _context.PurchaseOrders.Remove(po);
            }
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}

