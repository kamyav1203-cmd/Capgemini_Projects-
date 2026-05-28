namespace HospitalManagement.API.Interfaces
{
    /*
        Interface for audit logging service.
    */

    public interface IAuditService
    {
        // Store audit activity
        Task LogActivity(string userId, string action);
    }
}