using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace JwtRoleAuthAPI.Controller
{
    [ApiController]
    [Route("api/[controller]")]
 
    public class UserController : ControllerBase
    {
        //This endpoint is protected and can only be accessed by users with the "User" role
        [HttpGet("dashboard")]
        [Authorize(Roles = "User")]
        public IActionResult GetUserDashboard()
        {
            return Ok("Welcome to the User Dashboard! Only users with the User role can see this.");
        }
    }
}