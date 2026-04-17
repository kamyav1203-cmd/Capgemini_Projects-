using System.ComponentModel.DataAnnotations;

namespace FootwearCatalogue.Models.Attributes
{
    public class PriceRangeAttribute : ValidationAttribute
    {
        public decimal Min { get; }
        public decimal Max { get; }

        public PriceRangeAttribute(double min, double max)
        {
            Min = (decimal)min;
            Max = (decimal)max;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is not decimal price)
                return new ValidationResult("Price must be a decimal number.");

            if (price < Min || price > Max)
                return new ValidationResult($"Price must be between {Min} and {Max}.");

            return ValidationResult.Success;
        }
    }
}

