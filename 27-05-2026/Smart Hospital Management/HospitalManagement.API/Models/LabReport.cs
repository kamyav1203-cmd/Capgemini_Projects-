namespace HospitalManagement.API.Models
{
    /*
        Stores patient lab reports.
    */

    public class LabReport
    {
        public int Id { get; set; }

        public int PatientId { get; set; }

        public Patient? Patient { get; set; }

        // Test name
        public string TestName { get; set; } = string.Empty;

        // Result details
        public string Result { get; set; } = string.Empty;

        // Optional file path
        public string FilePath { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}