namespace HospitalManagement.API.Models
{
    /*
        Stores important system activities.

        Useful for:
        - Security
        - Tracking changes
        - Monitoring
    */

    public class AuditLog
    {
        public int Id { get; set; }

        // User who performed action
        public string UserId { get; set; } = string.Empty;

        // Action details
        public string Action { get; set; } = string.Empty;

        // Timestamp
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}