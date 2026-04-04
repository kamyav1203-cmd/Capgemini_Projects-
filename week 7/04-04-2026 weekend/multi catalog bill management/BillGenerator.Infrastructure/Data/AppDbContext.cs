using BillGenerator.Domain.Entities;
using BillGenerator.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace BillGenerator.Infrastructure.Data;

/// <summary>
/// EF Core context for SQLite persistence.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<CatalogItem> CatalogItems => Set<CatalogItem>();
    public DbSet<Bill> Bills => Set<Bill>();
    public DbSet<BillLine> BillLines => Set<BillLine>();
    public DbSet<DailyInvoiceCounter> DailyInvoiceCounters => Set<DailyInvoiceCounter>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CatalogItem>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.Property(x => x.DefaultPrice).HasPrecision(18, 2);
            e.HasIndex(x => new { x.CatalogType, x.IsActive });
        });

        modelBuilder.Entity<Bill>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.InvoiceNumber).HasMaxLength(32);
            e.HasIndex(x => x.InvoiceNumber).IsUnique().HasFilter("[InvoiceNumber] IS NOT NULL");
            e.Property(x => x.DiscountValue).HasPrecision(18, 2);
            e.Property(x => x.TaxRatePercent).HasPrecision(9, 4);
            e.Property(x => x.Notes).HasMaxLength(2000);
            e.HasMany(x => x.Lines)
                .WithOne(x => x.Bill)
                .HasForeignKey(x => x.BillId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<BillLine>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Description).HasMaxLength(500).IsRequired();
            e.Property(x => x.UnitPrice).HasPrecision(18, 2);
            e.Property(x => x.LineTotal).HasPrecision(18, 2);
            e.HasOne(x => x.CatalogItem)
                .WithMany(x => x.BillLines)
                .HasForeignKey(x => x.CatalogItemId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<DailyInvoiceCounter>(e =>
        {
            e.HasKey(x => x.DateUtc);
            e.Property(x => x.DateUtc).HasConversion(
                v => v,
                v => DateTime.SpecifyKind(v.Date, DateTimeKind.Utc));
        });
    }

    /// <summary>
    /// Seed default catalog rows if the catalog table is empty (first run).
    /// </summary>
    public void EnsureSeedData()
    {
        if (CatalogItems.Any())
            return;

        var order = 0;
        void Add(CatalogType type, string name, decimal price) =>
            CatalogItems.Add(new CatalogItem
            {
                CatalogType = type,
                Name = name,
                DefaultPrice = price,
                IsActive = true,
                SortOrder = order++
            });

        Add(CatalogType.EntranceFee, "Adult", 25m);
        Add(CatalogType.EntranceFee, "Child", 12m);
        Add(CatalogType.EntranceFee, "Senior", 18m);
        Add(CatalogType.EntranceFee, "VIP", 45m);

        Add(CatalogType.DonationPreset, "Donation $5", 5m);
        Add(CatalogType.DonationPreset, "Donation $10", 10m);
        Add(CatalogType.DonationPreset, "Donation $25", 25m);
        Add(CatalogType.DonationPreset, "Donation $50", 50m);

        Add(CatalogType.SellingPrice, "T-Shirt", 22m);
        Add(CatalogType.SellingPrice, "Water bottle", 4.5m);
        Add(CatalogType.SellingPrice, "Snack pack", 8m);
        Add(CatalogType.SellingPrice, "Guided tour add-on", 15m);

        SaveChanges();
    }
}
