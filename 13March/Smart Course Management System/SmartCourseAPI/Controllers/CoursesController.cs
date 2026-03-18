using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartCourseAPI.Data;
using SmartCourseAPI.DTOs;
using SmartCourseAPI.Models;

namespace SmartCourseAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CoursesController(AppDbContext db)
    {
        _db = db;
    }

    // FR1 - GET api/courses
    // Returns all courses. Supports optional search and department filter.
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] int? departmentId)
    {
        // Load all courses along with their department info
        List<Course> courses = await _db.Courses
            .Include(c => c.Department)
            .ToListAsync();

        // Filter by search keyword if provided
        if (!string.IsNullOrWhiteSpace(search))
        {
            string keyword = search.ToLower();
            courses = courses.Where(c =>
                c.CourseName.ToLower().Contains(keyword) ||
                (c.Department != null && c.Department.DepartmentName.ToLower().Contains(keyword))
            ).ToList();
        }

        // Filter by department if provided
        if (departmentId != null)
        {
            courses = courses.Where(c => c.DepartmentId == departmentId).ToList();
        }

        // Build a simple response list
        var result = courses.Select(c => new
        {
            c.CourseId,
            c.CourseName,
            c.DepartmentId,
            DepartmentName = c.Department != null ? c.Department.DepartmentName : "",
            c.Credits,
            c.SeatsAvailable,
            c.TotalSeats,
            c.EnrolledCount
        }).ToList();

        return Ok(result);
    }

    // GET api/courses/5
    // Returns a single course by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        Course? course = await _db.Courses
            .Include(c => c.Department)
            .FirstOrDefaultAsync(c => c.CourseId == id);

        if (course == null)
        {
            return NotFound(new { error = "Course not found" });
        }

        var result = new
        {
            course.CourseId,
            course.CourseName,
            course.DepartmentId,
            DepartmentName = course.Department != null ? course.Department.DepartmentName : "",
            course.Credits,
            course.SeatsAvailable,
            course.TotalSeats,
            course.EnrolledCount
        };

        return Ok(result);
    }

    // FR3 - POST api/courses
    // Adds a new course. Admin only.
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CourseCreateDto dto)
    {
        // Check if department exists
        Department? dept = await _db.Departments.FindAsync(dto.DepartmentId);
        if (dept == null)
        {
            return BadRequest(new { error = "Department not found" });
        }

        // Create the new course
        Course newCourse = new Course();
        newCourse.CourseName = dto.CourseName;
        newCourse.DepartmentId = dto.DepartmentId;
        newCourse.Credits = dto.Credits;
        newCourse.TotalSeats = dto.TotalSeats;
        newCourse.EnrolledCount = 0;
        newCourse.SeatsAvailable = dto.TotalSeats > 0;

        _db.Courses.Add(newCourse);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Course added successfully", courseId = newCourse.CourseId });
    }

    // FR4 - PUT api/courses/5
    // Updates an existing course. Admin only.
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] CourseUpdateDto dto)
    {
        Course? course = await _db.Courses.FindAsync(id);
        if (course == null)
        {
            return NotFound(new { error = "Course not found" });
        }

        // Update course fields
        course.CourseName = dto.CourseName;
        course.DepartmentId = dto.DepartmentId;
        course.Credits = dto.Credits;
        course.TotalSeats = dto.TotalSeats;

        // Recalculate seat availability
        if (course.EnrolledCount < course.TotalSeats)
        {
            course.SeatsAvailable = true;
        }
        else
        {
            course.SeatsAvailable = false;
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Course updated successfully" });
    }

    // FR5 - DELETE api/courses/5
    // Deletes a course. Admin only.
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        Course? course = await _db.Courses.FindAsync(id);
        if (course == null)
        {
            return NotFound(new { error = "Course not found" });
        }

        _db.Courses.Remove(course);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Course deleted successfully" });
    }
}
