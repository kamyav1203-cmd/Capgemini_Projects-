using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartCourseAPI.Data;
using SmartCourseAPI.Models;

namespace SmartCourseAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public DepartmentsController(AppDbContext db)
    {
        _db = db;
    }

    // GET api/departments
    // Returns the list of all departments
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        List<Department> departments = await _db.Departments.ToListAsync();
        return Ok(departments);
    }
}
