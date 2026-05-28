namespace HospitalManagement.API.Models
{
    /*
        Stores doctor-specific details.
    */

    public class Doctor
    {
        public int Id { get; set; }

        // Linked ASP.NET Identity user
        public string UserId { get; set; } = string.Empty;

        public ApplicationUser? User { get; set; }

        // Doctor specialization
        public string Specialization { get; set; } = string.Empty;

        // Years of experience
        public int ExperienceYears { get; set; }

        // Consultation fees
        public decimal ConsultationFee { get; set; }

        // Availability status
        public bool IsAvailable { get; set; } = true;
    }
}