namespace HospitalManagement.API.DTOs
{
    /*
        DTO used during user registration.

        DTO = Data Transfer Object

        Prevents exposing full entity models
        directly to API clients.
    */

    public class RegisterDto
    {
        // Full name of user
        public string FullName { get; set; } = string.Empty;

        // Email for login
        public string Email { get; set; } = string.Empty;

        // Password
        public string Password { get; set; } = string.Empty;

        // User role
        // Example:
        // Patient, Doctor, Admin
        public string Role { get; set; } = string.Empty;

        // Branch assignment
        public int? BranchId { get; set; }
    }
}