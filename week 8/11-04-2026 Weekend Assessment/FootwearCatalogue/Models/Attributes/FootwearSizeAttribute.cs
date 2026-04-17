using System.ComponentModel.DataAnnotations;

namespace FootwearCatalogue.Models.Attributes
{
    public class FootwearSizeAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is not decimal size)
                return new ValidationResult("Size must be a decimal number.");

            // Simple demo range; adjust for your sizing system if needed.
            if (size < 1 || size > 15)
                return new ValidationResult("Size must be between 1 and 15 (US).");

            return ValidationResult.Success;
        }
    }
}

