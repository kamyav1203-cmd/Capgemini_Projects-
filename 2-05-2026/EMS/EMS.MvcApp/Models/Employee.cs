using System.ComponentModel.DataAnnotations;

namespace EMS.MvcApp.Models
{
    public class Employee
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Department { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required, Range(0, double.MaxValue)]
        public decimal Salary { get; set; }
    }
}
