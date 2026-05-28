using Microsoft.AspNetCore.Identity;

namespace HospitalManagement.API.Configurations
{
    /*
        RoleSeeder creates default roles automatically
        when application starts.

        This avoids manually inserting roles into database.
    */

    public static class RoleSeeder
    {
        public static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            // List of system roles
            string[] roles =
            {
                "Admin",
                "Doctor",
                "Patient",
                "Receptionist",
                "Pharmacist",
                "LabTechnician"
            };

            // Create roles if they do not exist
            foreach (var role in roles)
            {
                bool roleExists = await roleManager.RoleExistsAsync(role);

                if (!roleExists)
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}