using FoodOrdering.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FoodOrdering.Api.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<FoodItem> FoodItems => Set<FoodItem>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Category>().HasIndex(c => c.Name).IsUnique();
        builder.Entity<CartItem>().HasIndex(c => new { c.UserId, c.FoodItemId }).IsUnique();

        builder.Entity<FoodItem>()
            .HasOne(f => f.Category)
            .WithMany(c => c.FoodItems)
            .HasForeignKey(f => f.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<OrderDetail>()
            .HasOne(od => od.Order)
            .WithMany(o => o.OrderDetails)
            .HasForeignKey(od => od.OrderId);

        builder.Entity<OrderDetail>()
            .HasOne(od => od.FoodItem)
            .WithMany()
            .HasForeignKey(od => od.FoodItemId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
