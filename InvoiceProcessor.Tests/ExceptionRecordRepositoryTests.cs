using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Xunit;

public class ExceptionRecordRepositoryTests
{
    private static AppDbContext BuildContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task AddAsync_SavesExceptionRecord()
    {
        var dbName = nameof(AddAsync_SavesExceptionRecord);
        await using var ctx = BuildContext(dbName);
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

    [Fact]
    public async Task GetAllAsync_ReturnsInDescendingOrder()
    {
        var dbName = nameof(GetAllAsync_ReturnsInDescendingOrder);
        await using (var ctx = BuildContext(dbName))
        {
            ctx.ExceptionRecords!.AddRange(new[]
            {
                new ExceptionRecord { Id = Guid.NewGuid(), InvoiceId = Guid.NewGuid(), Reason = "Old", Timestamp = DateTime.UtcNow.AddDays(-1) },
                new ExceptionRecord { Id = Guid.NewGuid(), InvoiceId = Guid.NewGuid(), Reason = "New", Timestamp = DateTime.UtcNow }
            });
            await ctx.SaveChangesAsync();
        }

        await using (var ctx = BuildContext(dbName))
        {
            var repo = new ExceptionRecordRepository(ctx);
            var all = await repo.GetAllAsync();

            Assert.Equal(2, all.Count);
            Assert.Equal("New", all[0].Reason); // Newest first
        }
    }
}
