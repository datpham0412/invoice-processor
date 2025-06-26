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
        public DbSet<AppUser>? Users { get; set; }
        public DbSet<RefreshToken>? RefreshTokens { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.UserName).IsRequired().HasMaxLength(50);
                entity.Property(u => u.Password).IsRequired();
                entity.HasIndex(u => u.UserName).IsUnique();

                // Seed sample users
                // entity.HasData(
                //     new AppUser { Id = "userA", UserName = "userA@example.com", Password = "passA" },
                //     new AppUser { Id = "datpham0412", UserName = "tiendat041202@gmail.com", Password = "Dat041202" }
                // );
                
            });

            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasKey(i => i.Id);
                entity.Property(i => i.InvoiceNumber).IsRequired().HasMaxLength(50);
                entity.Property(i => i.PoNumber).HasMaxLength(50);
                entity.Property(i => i.VendorName).IsRequired().HasMaxLength(100);
                entity.Property(i => i.TotalAmount).HasColumnType("decimal(18,2)");
                entity.Property(i => i.Status).IsRequired();
                entity.Property(i => i.BlobUrl);
                entity.Property(i => i.UserId).IsRequired();

                entity.HasOne(i => i.User)
                    .WithMany()
                    .HasForeignKey(i => i.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(i => i.LineItems)
                      .WithOne()
                      .HasForeignKey(li => li.InvoiceId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(i => i.ExceptionRecords)                          
                    .WithOne(er => er.Invoice)
                    .HasForeignKey(er => er.InvoiceId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(i => new { i.UserId, i.VendorName, i.InvoiceNumber }).IsUnique();
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
                entity.Property(po => po.UserId).IsRequired();

                entity.HasOne(po => po.User)
                    .WithMany()
                    .HasForeignKey(po => po.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(po => po.LineItems)
                    .WithOne(li => li.PurchaseOrder)
                    .HasForeignKey(li => li.PurchaseOrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(po => new { po.UserId, po.PoNumber }).IsUnique();
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

