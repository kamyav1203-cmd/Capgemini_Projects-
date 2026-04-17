namespace FootwearCatalogue.Models.Entities
{
    public class FootwearItem
    {
        public Guid Id { get; set; }

        public required string Name { get; set; } // e.g., "Coastal Slide Sandal"
        public required string Brand { get; set; } // e.g., "ShoreStep"

        public required string Category { get; set; } // Sandals, Sneakers, Boots, Loafers, Heels...
        public string? Gender { get; set; } // Men, Women, Unisex, Kids

        public string? Material { get; set; } // Leather, EVA, Canvas...
        public string? Color { get; set; }

        public decimal Size { get; set; } // US size (simple single value for demo)
        public decimal Price { get; set; }

        public int Stock { get; set; }
        public int ReleaseYear { get; set; }
    }
}

