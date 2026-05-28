namespace HospitalManagement.API.Models
{
    /*
        Stores patient-specific information.

        Authentication details are stored in ApplicationUser.
        This table stores medical/profile details.
    */

    public class Patient
    {
        public int Id { get; set; }

        // Linked ASP.NET Identity user
        public string UserId { get; set; } = string.Empty;

        public ApplicationUser? User { get; set; }

        // Patient age
        public int Age { get; set; }

        // Gender
        public string Gender { get; set; } = string.Empty;

        // Blood group
        public string BloodGroup { get; set; } = string.Empty;

        // Emergency contact number
        public string EmergencyContact { get; set; } = string.Empty;

        // Medical history
        public string MedicalHistory { get; set; } = string.Empty;
    }
}