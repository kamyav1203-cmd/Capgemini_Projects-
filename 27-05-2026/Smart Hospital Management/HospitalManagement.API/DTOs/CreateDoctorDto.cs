namespace HospitalManagement.API.DTOs
{
    /*
        DTO used for creating doctor records.
    */

    public class CreateDoctorDto
    {
        // Linked Identity User ID
        public string UserId { get; set; } = string.Empty;

        // Doctor specialization
        public string Specialization { get; set; } = string.Empty;

        // Years of experience
        public int ExperienceYears { get; set; }

        // Consultation fees
        public decimal ConsultationFee { get; set; }
    }
}