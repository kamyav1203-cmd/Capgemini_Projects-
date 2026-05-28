namespace HospitalManagement.API.Models
{
    /*
        Handles emergency tracking requests.
    */

    public class EmergencyRequest
    {
        public int Id { get; set; }

        public int PatientId { get; set; }

        public Patient? Patient { get; set; }

        // Emergency message
        public string Description { get; set; } = string.Empty;

        // Current status
        // Active / Resolved
        public string Status { get; set; } = "Active";

        // Emergency location
        public string Location { get; set; } = string.Empty;

        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    }
}