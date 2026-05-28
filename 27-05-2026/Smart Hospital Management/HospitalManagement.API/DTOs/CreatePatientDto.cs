namespace HospitalManagement.API.DTOs
{
    /*
        DTO used for creating patient records.
    */

    public class CreatePatientDto
    {
        // Linked Identity User ID
        public string UserId { get; set; } = string.Empty;

        // Age of patient
        public int Age { get; set; }

        // Gender
        public string Gender { get; set; } = string.Empty;

        // Blood group
        public string BloodGroup { get; set; } = string.Empty;

        // Emergency contact
        public string EmergencyContact { get; set; } = string.Empty;

        // Medical history
        public string MedicalHistory { get; set; } = string.Empty;
    }
}