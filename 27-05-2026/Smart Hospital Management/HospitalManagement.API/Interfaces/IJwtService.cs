using HospitalManagement.API.Models;

namespace HospitalManagement.API.Interfaces
{
    /*
        Interface for JWT token generation service.
    */

    public interface IJwtService
    {
        // Generate JWT token for authenticated user
        Task<string> GenerateToken(ApplicationUser user);
    }
}