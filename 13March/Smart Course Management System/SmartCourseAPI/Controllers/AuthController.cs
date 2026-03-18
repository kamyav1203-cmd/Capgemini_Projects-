using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartCourseAPI.Data;
using SmartCourseAPI.DTOs;
using SmartCourseAPI.Models;
using SmartCourseAPI.Services;

namespace SmartCourseAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Tags("Authentication")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwt;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext db, JwtService jwt, IConfiguration config)
    {
        _db = db;
        _jwt = jwt;
        _config = config;
    }

    // POST api/auth/register
    // Creates a new student or admin account
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        // Step 1: Check if email is already used
        bool emailExists = await _db.Students.AnyAsync(s => s.Email == dto.Email);
        if (emailExists)
        {
            return Conflict(new { error = "Email already registered" });
        }

        // Step 2: Password must be at least 6 characters
        if (dto.Password.Length < 6)
        {
            return BadRequest(new { error = "Password must be at least 6 characters" });
        }

        // Step 3: Only allow Student or Admin roles
        string role = "Student";
        if (dto.Role == "Admin")
        {
            role = "Admin";
        }

        // Step 4: Create the student record with hashed password
        Student newStudent = new Student();
        newStudent.Name = dto.Name.Trim();
        newStudent.Email = dto.Email.Trim().ToLower();
        newStudent.Phone = dto.Phone.Trim();
        newStudent.Role = role;
        newStudent.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        _db.Students.Add(newStudent);
        await _db.SaveChangesAsync();

        // Step 5: Generate and return JWT token
        string token = _jwt.GenerateToken(newStudent);
        int expiryHours = int.Parse(_config["Jwt:ExpiryHours"]!);
        DateTime expiresAt = DateTime.UtcNow.AddHours(expiryHours);

        AuthResponseDto response = new AuthResponseDto();
        response.Token = token;
        response.StudentId = newStudent.StudentId;
        response.Name = newStudent.Name;
        response.Email = newStudent.Email;
        response.Role = newStudent.Role;
        response.ExpiresAt = expiresAt;

        return Ok(response);
    }

    // POST api/auth/login
    // Checks email and password, returns a JWT token if correct
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        // Step 1: Find student by email
        string emailLower = dto.Email.Trim().ToLower();
        Student? student = await _db.Students.FirstOrDefaultAsync(s => s.Email == emailLower);

        // Step 2: Check student exists
        if (student == null)
        {
            return Unauthorized(new { error = "Invalid email or password" });
        }

        // Step 3: Verify password
        bool passwordCorrect = BCrypt.Net.BCrypt.Verify(dto.Password, student.PasswordHash);
        if (!passwordCorrect)
        {
            return Unauthorized(new { error = "Invalid email or password" });
        }

        // Step 4: Generate and return JWT token
        string token = _jwt.GenerateToken(student);
        int expiryHours = int.Parse(_config["Jwt:ExpiryHours"]!);
        DateTime expiresAt = DateTime.UtcNow.AddHours(expiryHours);

        AuthResponseDto response = new AuthResponseDto();
        response.Token = token;
        response.StudentId = student.StudentId;
        response.Name = student.Name;
        response.Email = student.Email;
        response.Role = student.Role;
        response.ExpiresAt = expiresAt;

        return Ok(response);
    }
}
