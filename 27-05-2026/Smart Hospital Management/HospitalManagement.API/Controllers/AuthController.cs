using HospitalManagement.API.DTOs;
using HospitalManagement.API.Models;
using HospitalManagement.API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HospitalManagement.API.Controllers
{
    /*
        Handles:
        - User Registration
        - User Login
        - JWT Authentication
    */

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        private readonly SignInManager<ApplicationUser> _signInManager;

        private readonly IJwtService _jwtService;

        /*
            Constructor Dependency Injection
        */
        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IJwtService jwtService
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
        }

        /*
            ---------------------------------------------------
            REGISTER API
            ---------------------------------------------------

            Creates:
            - ASP.NET Identity User
            - Assigns Role
        */

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            /*
                Check if email already exists
            */
            var existingUser =
                await _userManager.FindByEmailAsync(model.Email);

            if (existingUser != null)
            {
                return BadRequest(new
                {
                    Message = "User already exists with this email."
                });
            }

            /*
                Create new ApplicationUser
            */
            var user = new ApplicationUser
            {
                FullName = model.FullName,
                Email = model.Email,
                UserName = model.Email,
                Role = model.Role,
                BranchId = model.BranchId
            };

            /*
                Create user with hashed password
            */
            var result =
                await _userManager.CreateAsync(
                    user,
                    model.Password
                );

            /*
                If user creation fails
            */
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            /*
                Assign role to user
            */
            await _userManager.AddToRoleAsync(
                user,
                model.Role
            );

            /*
                Generate JWT token
            */
            var token =
                await _jwtService.GenerateToken(user);

            /*
                Return authentication response
            */
            return Ok(new AuthResponseDto
            {
                Token = token,
                Email = user.Email!,
                Role = user.Role,
                Expiration =
                    DateTime.UtcNow.AddMinutes(120)
            });
        }

        /*
            ---------------------------------------------------
            LOGIN API
            ---------------------------------------------------

            Validates:
            - Email
            - Password

            Returns:
            - JWT Token
            - Role
        */

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto model)
        {
            /*
                Find user by email
            */
            var user =
                await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                return Unauthorized(new
                {
                    Message = "Invalid email or password."
                });
            }

            /*
                Validate password
            */
            var result =
                await _signInManager.CheckPasswordSignInAsync(
                    user,
                    model.Password,
                    false
                );

            if (!result.Succeeded)
            {
                return Unauthorized(new
                {
                    Message = "Invalid email or password."
                });
            }

            /*
                Generate JWT token
            */
            var token =
                await _jwtService.GenerateToken(user);

            /*
                Return authentication response
            */
            return Ok(new AuthResponseDto
            {
                Token = token,
                Email = user.Email!,
                Role = user.Role,
                Expiration =
                    DateTime.UtcNow.AddMinutes(120)
            });
        }
    }
}