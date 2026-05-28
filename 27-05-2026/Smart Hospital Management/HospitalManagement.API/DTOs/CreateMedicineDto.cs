namespace HospitalManagement.API.DTOs
{
    /*
        DTO used for adding medicines.
    */

    public class CreateMedicineDto
    {
        // Medicine name
        public string Name { get; set; } = string.Empty;

        // Manufacturer
        public string Manufacturer { get; set; } = string.Empty;

        // Price
        public decimal Price { get; set; }

        // Stock quantity
        public int StockQuantity { get; set; }

        // Expiry date
        public DateTime ExpiryDate { get; set; }
    }
}