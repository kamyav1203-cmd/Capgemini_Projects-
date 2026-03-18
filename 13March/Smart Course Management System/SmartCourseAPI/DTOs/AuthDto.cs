namespace SmartCourseAPI.DTOs;

// Data sent by user when registering
public class RegisterDto
{
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Password { get; set; } = "";
    public string Role { get; set; } = "Student"; // Student or Admin
}

// Data sent by user when logging in
public class LoginDto
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}

// Data returned to user after successful login or register
public class AuthResponseDto
{
    public string Token { get; set; } = "";
    public int StudentId { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Role { get; set; } = "";
    public DateTime ExpiresAt { get; set; }
}
