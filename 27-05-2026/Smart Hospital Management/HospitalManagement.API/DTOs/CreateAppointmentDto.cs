namespace HospitalManagement.API.DTOs
{
    /*
        DTO used for appointment booking.
    */

    public class CreateAppointmentDto
    {
        // Patient Id
        public int PatientId { get; set; }

        // Doctor Id
        public int DoctorId { get; set; }

        // Appointment date and time
        public DateTime AppointmentDate { get; set; }

        // Patient symptoms/details
        public string Symptoms { get; set; } = string.Empty;
    }
}