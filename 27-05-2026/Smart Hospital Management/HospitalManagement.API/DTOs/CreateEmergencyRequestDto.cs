namespace HospitalManagement.API.DTOs
{
    /*
        DTO used for emergency requests.
    */

    public class CreateEmergencyRequestDto
    {
        // Patient Id
        public int PatientId { get; set; }

        // Emergency details
        public string Description { get; set; } = string.Empty;

        // Patient location
        public string Location { get; set; } = string.Empty;
    }
}