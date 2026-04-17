using System.ComponentModel.DataAnnotations;
using FootwearCatalogue.Models.Attributes;

namespace FootwearCatalogue.Models.DTOs
{
    public class CreateFootwearDto
    {
        [Required]
        [ProductName]
        public required string Name { get; set; }

        [Required]
        public required string Brand { get; set; }

        [Required]
        public required string Category { get; set; }

        public string? Gender { get; set; }
        public string? Material { get; set; }
        public string? Color { get; set; }

        [Required]
        [FootwearSize]
        public decimal Size { get; set; }

        [Required]
        [PriceRange(5, 500)]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        [Range(1900, 2100)]
        public int ReleaseYear { get; set; }
    }
}

