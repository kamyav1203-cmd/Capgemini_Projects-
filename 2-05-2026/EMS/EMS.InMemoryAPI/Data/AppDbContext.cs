using Microsoft.EntityFrameworkCore;
using EMS.InMemoryAPI.Models;

namespace EMS.InMemoryAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }
    }
}
