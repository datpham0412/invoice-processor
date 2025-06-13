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
        public DbSet<PurchaseOrder>? PurchaseOrders { get; set; }
        public DbSet<ExceptionRecord>? ExceptionRecords { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasKey(i => i.Id);
                entity.Property(i => i.InvoiceNumber).IsRequired().HasMaxLength(50);
                entity.Property(i => i.PoNumber).HasMaxLength(50);
                entity.Property(i => i.VendorName).IsRequired().HasMaxLength(100);
                entity.Property(i => i.TotalAmount).HasColumnType("decimal(18,2)");
                entity.Property(i => i.Status).IsRequired();
                entity.Property(i => i.BlobUrl);
                entity.HasMany(i => i.LineItems)
                      .WithOne()
                      .HasForeignKey(li => li.InvoiceId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(i => new { i.VendorName, i.InvoiceNumber }).IsUnique();
            });

            modelBuilder.Entity<LineItem>(entity =>
            {
                entity.HasKey(li => li.Id);
                entity.Property(li => li.Description);
                entity.Property(li => li.Quantity).HasColumnType("decimal(18,2)");
                entity.Property(li => li.UnitPrice).HasColumnType("decimal(18,2)");
                entity.Property(li => li.Amount).HasColumnType("decimal(18,2)");
            });

            modelBuilder.Entity<PurchaseOrder>(entity =>
            {
                entity.HasKey(po => po.Id);
                entity.Property(po => po.PoNumber).IsRequired().HasMaxLength(50);
                entity.Property(po => po.VendorName).IsRequired().HasMaxLength(100);
                entity.Property(po => po.IssueDate).IsRequired();

                entity.HasMany(po => po.LineItems)
                    .WithOne(li => li.PurchaseOrder)
                    .HasForeignKey(li => li.PurchaseOrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(po => po.PoNumber).IsUnique();
                entity.Property(po => po.TotalAmount).HasColumnType("decimal(18,2)");
            });

            modelBuilder.Entity<POLineItem>(entity =>
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

