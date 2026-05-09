using FoodOrdering.Api.Data;
using FoodOrdering.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FoodOrdering.Api.Extensions;

public static class DatabaseSeeder
{
    public static async Task SeedDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        if (dbContext.Database.IsRelational() && dbContext.Database.GetMigrations().Any())
        {
            await dbContext.Database.MigrateAsync();
        }
        else
        {
            await dbContext.Database.EnsureCreatedAsync();
        }

        foreach (var role in new[] { "Admin", "Customer" })
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        var adminEmail = "admin@food.local";
        var admin = await userManager.FindByEmailAsync(adminEmail);
        if (admin is null)
        {
            admin = new ApplicationUser { UserName = adminEmail, Email = adminEmail, FullName = "System Admin", EmailConfirmed = true };
            await userManager.CreateAsync(admin, "Admin@123");
            await userManager.AddToRoleAsync(admin, "Admin");
        }

        if (!await dbContext.Categories.AnyAsync())
        {
            var categories = new[]
            {
                new Category { Name = "Pizza", Description = "Wood-fired and classic pizzas" },
                new Category { Name = "Burgers", Description = "Stacked burgers and sides" },
                new Category { Name = "Desserts", Description = "Sweet finishers" }
            };
            await dbContext.Categories.AddRangeAsync(categories);
            await dbContext.SaveChangesAsync();

            await dbContext.FoodItems.AddRangeAsync(
                new FoodItem { Name = "Margherita Pizza", Description = "Mozzarella, tomato, and basil", Price = 299, CategoryId = categories[0].Id, ImageUrl = "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=900&q=80" },
                new FoodItem { Name = "Classic Cheeseburger", Description = "Beef patty, cheddar, lettuce, tomato", Price = 249, CategoryId = categories[1].Id, ImageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80" },
                new FoodItem { Name = "Chocolate Brownie", Description = "Warm brownie with chocolate sauce", Price = 149, CategoryId = categories[2].Id, ImageUrl = "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80" });
            await dbContext.SaveChangesAsync();
        }
    }
}
