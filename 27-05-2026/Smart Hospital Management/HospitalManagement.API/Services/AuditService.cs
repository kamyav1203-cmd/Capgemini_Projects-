using HospitalManagement.API.Data;
using HospitalManagement.API.Interfaces;
using HospitalManagement.API.Models;

namespace HospitalManagement.API.Services
{
    /*
        Handles system audit logging.
    */

    public class AuditService : IAuditService
    {
        private readonly ApplicationDbContext _context;

        /*
            Constructor Dependency Injection
        */
        public AuditService(ApplicationDbContext context)
        {
            _context = context;
        }

        /*
            Save activity into AuditLogs table
        */
        public async Task LogActivity(
            string userId,
            string action
        )
        {
            var log = new AuditLog
            {
                UserId = userId,
                Action = action,
                Timestamp = DateTime.UtcNow
            };

            _context.AuditLogs.Add(log);

            await _context.SaveChangesAsync();
        }
    }
}