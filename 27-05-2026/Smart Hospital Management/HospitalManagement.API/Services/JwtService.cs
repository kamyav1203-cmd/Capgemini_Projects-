using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HospitalManagement.API.Interfaces;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace HospitalManagement.API.Services
{
    /*
        Handles JWT token generation.
    */

    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;

        /*
            Constructor Dependency Injection
        */
        public JwtService(
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager
        )
        {
            _configuration = configuration;
            _userManager = userManager;
        }

        /*
            Generate JWT token after successful login.
        */
        public async Task<string> GenerateToken(ApplicationUser user)
        {
            // Get user roles
            var roles = await _userManager.GetRolesAsync(user);

            /*
                Create claims for JWT payload
            */
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),

                new Claim(JwtRegisteredClaimNames.Email, user.Email!),

                new Claim(ClaimTypes.Name, user.FullName),

                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            /*
                Add role claims
            */
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            /*
                Create signing credentials
            */
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _configuration["Jwt:Key"]!
                )
            );

            var credentials =
                new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256
                );

            /*
                Token expiration time
            */
            var expiration =
                DateTime.UtcNow.AddMinutes(
                    Convert.ToDouble(
                        _configuration["Jwt:DurationInMinutes"]
                    )
                );

            /*
                Create JWT token
            */
            var token =
                new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: expiration,
                    signingCredentials: credentials
                );

            /*
                Return serialized token
            */
            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}