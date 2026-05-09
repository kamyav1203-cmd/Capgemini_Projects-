using System.Security.Claims;

namespace FoodOrdering.Api.Services;

public static class CurrentUser
{
    public static string GetUserId(this ClaimsPrincipal user)
        => user.FindFirstValue(ClaimTypes.NameIdentifier)
           ?? throw new UnauthorizedAccessException("User id claim is missing.");
}
