using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SmartCourseAPI.Models;

namespace SmartCourseAPI.Services;

// This service is responsible for creating JWT tokens
public class JwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    // Creates a JWT token for a student after login or register
    public string GenerateToken(Student student)
    {
        // Get the secret key from appsettings.json
        string secretKey = _config["Jwt:Key"]!;
        byte[] keyBytes = Encoding.UTF8.GetBytes(secretKey);
        SymmetricSecurityKey key = new SymmetricSecurityKey(keyBytes);
        SigningCredentials credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Set token expiry time
        int hours = int.Parse(_config["Jwt:ExpiryHours"]!);
        DateTime expiryTime = DateTime.UtcNow.AddHours(hours);

        // Add user information (claims) into the token
        List<Claim> claims = new List<Claim>();
        claims.Add(new Claim(JwtRegisteredClaimNames.Sub, student.StudentId.ToString()));
        claims.Add(new Claim(JwtRegisteredClaimNames.Email, student.Email));
        claims.Add(new Claim(ClaimTypes.Name, student.Name));
        claims.Add(new Claim(ClaimTypes.Role, student.Role));

        // Build the token
        JwtSecurityToken token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expiryTime,
            signingCredentials: credentials
        );

        // Convert token object to string and return
        string tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        return tokenString;
    }
}
