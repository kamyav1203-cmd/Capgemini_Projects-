namespace HospitalManagement.API.DTOs
{
    /*
        DTO used for uploading lab reports.
    */

    public class CreateLabReportDto
    {
        // Patient Id
        public int PatientId { get; set; }

        // Test name
        public string TestName { get; set; } = string.Empty;

        // Report result
        public string Result { get; set; } = string.Empty;

        // Optional report file path
        public string FilePath { get; set; } = string.Empty;
    }
}