using BillGenerator.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace BillGenerator.Infrastructure;

/// <summary>
/// Registers SQLite <see cref="AppDbContext"/> with DI.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string sqliteConnectionString)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlite(
                sqliteConnectionString,
                // Migrations live in this assembly (Infrastructure), not the startup API project.
                sqlite => sqlite.MigrationsAssembly(typeof(AppDbContext).Assembly.GetName().Name!)));
        return services;
    }
}
