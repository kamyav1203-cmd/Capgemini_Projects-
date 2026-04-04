using BillGenerator.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace BillGenerator.Infrastructure;

/// <summary>
/// Allows <c>dotnet ef migrations</c> without running the web host.
/// </summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite("Data Source=billgenerator.db")
            .Options;
        return new AppDbContext(options);
    }
}
