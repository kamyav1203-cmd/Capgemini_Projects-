namespace HospitalManagement.API.DTOs
{
    /*
        DTO returned after appointment operations.
    */

    public class AppointmentResponseDto
    {
        public int Id { get; set; }

        public string PatientName { get; set; } = string.Empty;

        public string DoctorName { get; set; } = string.Empty;

        public DateTime AppointmentDate { get; set; }

        public string Status { get; set; } = string.Empty;

        public string Symptoms { get; set; } = string.Empty;
    }
}