using System.ComponentModel.DataAnnotations;

namespace FootwearCatalogue.Models.Attributes
{
    public class ProductNameAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var name = value as string;
            if (string.IsNullOrWhiteSpace(name))
                return new ValidationResult("Product name is required.");

            var trimmed = name.Trim();

            if (trimmed.Length < 3)
                return new ValidationResult("Product name must be at least 3 characters long.");

            if (!char.IsLetter(trimmed[0]) || !char.IsUpper(trimmed[0]))
                return new ValidationResult("Product name must start with an uppercase letter.");

            return ValidationResult.Success;
        }
    }
}

