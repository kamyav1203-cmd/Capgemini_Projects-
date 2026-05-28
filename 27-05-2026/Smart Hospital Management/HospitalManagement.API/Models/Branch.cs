namespace HospitalManagement.API.Models
{
    /*
        Represents different hospital branches.

        Example:
        - Jaipur Branch
        - Delhi Branch
        - Mumbai Branch
    */

    public class Branch
    {
        public int Id { get; set; }

        // Branch name
        public string Name { get; set; } = string.Empty;

        // Branch address
        public string Address { get; set; } = string.Empty;

        // Contact number
        public string ContactNumber { get; set; } = string.Empty;

        // Navigation property
        public ICollection<ApplicationUser>? Users { get; set; }
    }
}