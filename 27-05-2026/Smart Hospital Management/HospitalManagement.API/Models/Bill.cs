namespace HospitalManagement.API.Models
{
    /*
        Handles billing and payment tracking.
    */

    public class Bill
    {
        public int Id { get; set; }

        public int PatientId { get; set; }

        public Patient? Patient { get; set; }

        // Total bill amount
        public decimal Amount { get; set; }

        // Payment status
        // Paid / Pending
        public string PaymentStatus { get; set; } = "Pending";

        // Payment method
        public string PaymentMethod { get; set; } = string.Empty;

        // Billing date
        public DateTime BillingDate { get; set; } = DateTime.UtcNow;
    }
}