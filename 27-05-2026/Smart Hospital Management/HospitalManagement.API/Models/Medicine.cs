namespace HospitalManagement.API.Models
{
    /*
        Represents pharmacy medicines inventory.
    */

    public class Medicine
    {
        public int Id { get; set; }

        // Medicine name
        public string Name { get; set; } = string.Empty;

        // Manufacturer/company
        public string Manufacturer { get; set; } = string.Empty;

        // Medicine price
        public decimal Price { get; set; }

        // Available stock quantity
        public int StockQuantity { get; set; }

        // Expiry date
        public DateTime ExpiryDate { get; set; }
    }
}