namespace HospitalManagement.API.DTOs
{
    /*
        Returned after successful login/register.
    */

    public class AuthResponseDto
    {
        // JWT token
        public string Token { get; set; } = string.Empty;

        // User email
        public string Email { get; set; } = string.Empty;

        // User role
        public string Role { get; set; } = string.Empty;

        // Token expiry
        public DateTime Expiration { get; set; }
    }
}