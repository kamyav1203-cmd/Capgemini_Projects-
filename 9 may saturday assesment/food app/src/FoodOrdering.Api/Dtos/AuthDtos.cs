using System.ComponentModel.DataAnnotations;

namespace FoodOrdering.Api.Dtos;

public record RegisterRequest(
    [Required, MaxLength(100)] string FullName,
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password);

public record LoginRequest([Required, EmailAddress] string Email, [Required] string Password);
public record AuthResponse(string Token, string Email, string FullName, IReadOnlyList<string> Roles);
public record ForgotPasswordRequest([Required, EmailAddress] string Email);
public record ForgotPasswordResponse(string Message, string SimulatedResetToken);
