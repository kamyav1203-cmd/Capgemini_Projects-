using Microsoft.AspNetCore.Identity;

namespace HospitalManagement.API.Models
{
    /*
        ApplicationUser class extends ASP.NET IdentityUser.

        IdentityUser already contains:
        - Id
        - Email
        - PasswordHash
        - UserName
        - PhoneNumber

        We are adding custom properties required for our
        Hospital Management System.
    */

    public class ApplicationUser : IdentityUser
    {
        // Full name of user
        public string FullName { get; set; } = string.Empty;

        // Role of the user
        // Example:
        // Admin, Doctor, Patient, Receptionist
        public string Role { get; set; } = string.Empty;

        // Branch assignment
        // Useful for multi-branch hospitals
        public int? BranchId { get; set; }

        // Navigation property
        public Branch? Branch { get; set; }

        // Record creation timestamp
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}