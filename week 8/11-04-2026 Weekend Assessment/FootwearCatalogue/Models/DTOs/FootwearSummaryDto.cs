namespace FootwearCatalogue.Models.DTOs
{
    public class FootwearSummaryDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Brand { get; set; }
        public required string Category { get; set; }
        public decimal Size { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
    }
}

