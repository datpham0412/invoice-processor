using System;
using System.Linq;
using System.Threading.Tasks;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Infrastructure.Persistence;   
using Microsoft.EntityFrameworkCore;
using Xunit;

public class PurchaseOrderRepositoryTests
{
    private const string TestUserId = "userA";
    
    private static AppDbContext BuildContext(string dbName)
    {
        var opt = new DbContextOptionsBuilder<AppDbContext>()
                 .UseInMemoryDatabase(dbName)
                 .EnableSensitiveDataLogging()
                 .Options;
        return new AppDbContext(opt);
    }

    [Fact]
    public async Task AddAsync_SetsAmountsAndPersists()
    {
        // Arrange
        await using var ctx = BuildContext(nameof(AddAsync_SetsAmountsAndPersists));
        var repo = new PurchaseOrderRepository(ctx);

        var po = new PurchaseOrder
        {
            Id = Guid.NewGuid(),
            PoNumber = "PO-001",
            VendorName = "Acme Corp",
            IssueDate = DateTime.UtcNow,
            UserId = TestUserId,
            LineItems =
            {
                new POLineItem { Id = Guid.NewGuid(), Quantity = 2, UnitPrice = 50 },
                new POLineItem { Id = Guid.NewGuid(), Quantity = 1, UnitPrice = 25 }
            }
        };

        // Act
        await repo.AddAsync(po);
        await repo.SaveChangesAsync();

        // Assert
        var saved = await ctx.PurchaseOrders!.Include(p => p.LineItems)
                                            .FirstAsync();
        Assert.Equal(125m, saved.TotalAmount);          // 2×50 + 1×25
        Assert.All(saved.LineItems, li =>
                 Assert.Equal(li.Quantity * li.UnitPrice, li.Amount));
    }

    [Fact]
    public async Task GetByPoNumberAsync_ReturnsCorrectPO()
    {
        await using var ctx = BuildContext(nameof(GetByPoNumberAsync_ReturnsCorrectPO));
        ctx.PurchaseOrders!.Add(new PurchaseOrder
        {
            Id = Guid.NewGuid(),
            PoNumber = "PO-123",
            VendorName = "Acme",
            IssueDate = DateTime.UtcNow,
            TotalAmount = 10,
            UserId = TestUserId
        });
        await ctx.SaveChangesAsync();

        var repo = new PurchaseOrderRepository(ctx);

        var po = await repo.GetByPoNumberAsync("PO-123", TestUserId);

        Assert.NotNull(po);
        Assert.Equal("Acme", po!.VendorName);
    }

    [Fact]
    public async Task UpdateAsync_PersistsChanges()
    {
        var dbName = nameof(UpdateAsync_PersistsChanges);
        await using (var ctx = BuildContext(dbName))
        {
            ctx.PurchaseOrders!.Add(new PurchaseOrder
            {
                Id = Guid.NewGuid(),
                PoNumber = "PO-X",
                VendorName = "Old",
                IssueDate = DateTime.UtcNow,
                TotalAmount = 1,
                UserId = TestUserId
            });
            await ctx.SaveChangesAsync();
        }

        await using (var ctx = BuildContext(dbName))
        {
            var repo = new PurchaseOrderRepository(ctx);
            var po = await repo.GetByPoNumberAsync("PO-X", TestUserId);
            Assert.NotNull(po);
            po!.VendorName = "New";
            await repo.UpdateAsync(po);
        }

        await using var verifyCtx = BuildContext(dbName);
        var updated = await verifyCtx.PurchaseOrders!.FirstAsync();
        Assert.Equal("New", updated.VendorName);
    }

    [Fact]
    public async Task DeleteAsync_RemovesPO()
    {
        var dbName = nameof(DeleteAsync_RemovesPO);
        var id = Guid.NewGuid();

        await using (var ctx = BuildContext(dbName))
        {
            ctx.PurchaseOrders!.Add(new PurchaseOrder
            {
                Id = id,
                PoNumber = "PO-Z",
                VendorName = "RemoveMe",
                IssueDate = DateTime.UtcNow,
                TotalAmount = 5,
                UserId = TestUserId
            });
            await ctx.SaveChangesAsync();
        }

        await using (var ctx = BuildContext(dbName))
        {
            var repo = new PurchaseOrderRepository(ctx);
            await repo.DeleteAsync(id, TestUserId);
            await repo.SaveChangesAsync();
        }

        await using var verifyCtx = BuildContext(dbName);
        Assert.False(verifyCtx.PurchaseOrders!.Any());
    }
}
