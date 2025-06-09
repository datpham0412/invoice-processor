
using InvoiceProcessor.API.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InvoiceProcessor.API.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Invoice>? Invoices { get; set; }
        public DbSet<LineItem>? LineItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasKey(i => i.Id);
                entity.Property(i => i.InvoiceNumber).IsRequired().HasMaxLength(50);
                entity.Property(i => i.VendorName).IsRequired().HasMaxLength(100);
                entity.Property(i => i.TotalAmount).HasColumnType("decimal(18,2)");
                entity.Property(i => i.Status).IsRequired();
                entity.Property(i => i.BlobUrl);
                entity.HasMany(i => i.LineItems)
                      .WithOne()
                      .HasForeignKey(li => li.InvoiceId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<LineItem>(entity =>
            {
                entity.HasKey(li => li.Id);
                entity.Property(li => li.Description);
                entity.Property(li => li.Quantity).HasColumnType("decimal(18,2)");
                entity.Property(li => li.UnitPrice).HasColumnType("decimal(18,2)");
                entity.Property(li => li.Amount).HasColumnType("decimal(18,2)");
            });
        }
    }
}

