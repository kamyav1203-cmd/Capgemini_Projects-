namespace HospitalManagement.API.DTOs
{
    /*
        DTO used for creating patient bills.
    */

    public class CreateBillDto
    {
        // Patient Id
        public int PatientId { get; set; }

        // Bill amount
        public decimal Amount { get; set; }

        // Payment method
        // Example:
        // Cash, Card, UPI
        public string PaymentMethod { get; set; } = string.Empty;
    }
}