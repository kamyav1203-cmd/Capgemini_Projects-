namespace HospitalManagement.API.DTOs
{
    /*
        DTO used for login requests.
    */

    public class LoginDto
    {
        // Email address
        public string Email { get; set; } = string.Empty;

        // Password
        public string Password { get; set; } = string.Empty;
    }
}