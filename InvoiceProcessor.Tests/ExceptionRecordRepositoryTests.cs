using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Domain.Enums;
using InvoiceProcessor.API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Xunit;

public class ExceptionRecordRepositoryTests
{
    private static readonly InMemoryDatabaseRoot _root = new();

    private static AppDbContext BuildContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: dbName, databaseRoot: _root)
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsInDescendingOrder()
    {
        // Arrange
        var dbName = nameof(GetAllAsync_ReturnsInDescendingOrder);
        var ctx = BuildContext(dbName);
        
        try
        {
            // Create required Invoice records
            var invoice1 = new Invoice 
            { 
                Id = Guid.NewGuid(),
                InvoiceNumber = "INV-001",
                VendorName = "Test Vendor",
                Status = InvoiceStatus.Pending
            };
            var invoice2 = new Invoice 
            { 
                Id = Guid.NewGuid(),
                InvoiceNumber = "INV-002",
                VendorName = "Test Vendor",
                Status = InvoiceStatus.Pending
            };

            ctx.Invoices!.Add(invoice1);
            ctx.Invoices.Add(invoice2);
            await ctx.SaveChangesAsync();

            // Create and add first record
            var oldRecord = new ExceptionRecord 
            { 
                Id = Guid.NewGuid(), 
                InvoiceId = invoice1.Id,
                Reason = "Old", 
                Timestamp = DateTime.UtcNow.AddDays(-1) 
            };
            
            ctx.ExceptionRecords!.Add(oldRecord);
            await ctx.SaveChangesAsync();

            // Create and add second record
            var newRecord = new ExceptionRecord 
            { 
                Id = Guid.NewGuid(), 
                InvoiceId = invoice2.Id,
                Reason = "New", 
                Timestamp = DateTime.UtcNow 
            };
            
            ctx.ExceptionRecords.Add(newRecord);
            await ctx.SaveChangesAsync();

            // Test repository
            var repo = new ExceptionRecordRepository(ctx);
            var all = await repo.GetAllAsync();

            // Assert
            Assert.Equal(2, all.Count);
            Assert.Equal("New", all[0].Reason); // Newest first
            Assert.Equal("Old", all[1].Reason); // Oldest second
        }
        finally
        {
            await ctx.DisposeAsync();
        }
    }

    [Fact]
    public async Task AddAsync_SavesExceptionRecord()
    {
        var dbName = nameof(AddAsync_SavesExceptionRecord);
        var ctx = BuildContext(dbName);
        
        try
        {
            var repo = new ExceptionRecordRepository(ctx);

            var exception = new ExceptionRecord
            {
                Id = Guid.NewGuid(),
                InvoiceId = Guid.NewGuid(),
                Reason = "Test mismatch"
            };

            await repo.AddAsync(exception);
            await repo.SaveChangesAsync();

            var result = await ctx.ExceptionRecords!.FirstOrDefaultAsync();
            Assert.NotNull(result);
            Assert.Equal("Test mismatch", result!.Reason);
        }
        finally
        {
            await ctx.DisposeAsync();
        }
    }
}
