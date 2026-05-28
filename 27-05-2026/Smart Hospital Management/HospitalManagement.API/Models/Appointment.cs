namespace HospitalManagement.API.Models
{
    /*
        Handles appointment booking system.
    */

    public class Appointment
    {
        public int Id { get; set; }

        // Patient reference
        public int PatientId { get; set; }

        public Patient? Patient { get; set; }

        // Doctor reference
        public int DoctorId { get; set; }

        public Doctor? Doctor { get; set; }

        // Appointment date and time
        public DateTime AppointmentDate { get; set; }

        // Appointment status
        // Pending, Approved, Completed, Cancelled
        public string Status { get; set; } = "Pending";

        // Symptoms/description
        public string Symptoms { get; set; } = string.Empty;

        // Appointment creation timestamp
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}