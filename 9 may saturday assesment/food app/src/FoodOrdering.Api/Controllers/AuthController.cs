using FoodOrdering.Api.Dtos;
using FoodOrdering.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FoodOrdering.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        => Ok(await authService.RegisterAsync(request));

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        => Ok(await authService.LoginAsync(request));

    [HttpPost("forgot-password")]
    public async Task<ActionResult<ForgotPasswordResponse>> ForgotPassword(ForgotPasswordRequest request)
        => Ok(await authService.ForgotPasswordAsync(request));

    [HttpPost("logout")]
    public IActionResult Logout()
        => Ok(new { message = "JWT logout is handled on the client by removing the token." });
}
