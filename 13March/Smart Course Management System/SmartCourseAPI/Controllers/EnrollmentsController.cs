using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartCourseAPI.Data;
using SmartCourseAPI.DTOs;
using SmartCourseAPI.Models;

namespace SmartCourseAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public EnrollmentsController(AppDbContext db)
    {
        _db = db;
    }

    // FR8 - GET api/enrollments
    // Returns all enrollment records. Admin only.
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        List<Enrollment> enrollments = await _db.Enrollments
            .Include(e => e.Course)
            .ThenInclude(c => c!.Department)
            .Include(e => e.Student)
            .OrderByDescending(e => e.EnrollmentDate)
            .ToListAsync();

        var result = new List<object>();

        foreach (Enrollment e in enrollments)
        {
            string studentName = e.Student != null ? e.Student.Name : "";
            string courseName = e.Course != null ? e.Course.CourseName : "";
            string deptName = (e.Course != null && e.Course.Department != null) ? e.Course.Department.DepartmentName : "";

            result.Add(new
            {
                e.EnrollmentId,
                e.StudentId,
                StudentName = studentName,
                e.CourseId,
                CourseName = courseName,
                DepartmentName = deptName,
                e.EnrollmentDate,
                e.DropDate,
                e.IsActive
            });
        }

        return Ok(result);
    }

    // GET api/enrollments/student/5
    // Returns all active enrollments for a specific student
    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetByStudent(int studentId)
    {
        List<Enrollment> enrollments = await _db.Enrollments
            .Where(e => e.StudentId == studentId && e.IsActive == true)
            .Include(e => e.Course)
            .ThenInclude(c => c!.Department)
            .ToListAsync();

        var result = new List<object>();

        foreach (Enrollment e in enrollments)
        {
            string courseName = e.Course != null ? e.Course.CourseName : "";
            string deptName = (e.Course != null && e.Course.Department != null) ? e.Course.Department.DepartmentName : "";
            int credits = e.Course != null ? e.Course.Credits : 0;
            int totalSeats = e.Course != null ? e.Course.TotalSeats : 0;
            int enrolledCount = e.Course != null ? e.Course.EnrolledCount : 0;

            result.Add(new
            {
                e.EnrollmentId,
                e.CourseId,
                CourseName = courseName,
                DepartmentName = deptName,
                Credits = credits,
                TotalSeats = totalSeats,
                EnrolledCount = enrolledCount,
                e.EnrollmentDate
            });
        }

        return Ok(result);
    }

    // FR6 - POST api/enrollments
    // Enrolls a student in a course
    [HttpPost]
    public async Task<IActionResult> Enroll([FromBody] EnrollRequestDto dto)
    {
        // Check student exists
        Student? student = await _db.Students.FindAsync(dto.StudentId);
        if (student == null)
        {
            return NotFound(new { error = "Student not found" });
        }

        // Check course exists
        Course? course = await _db.Courses.FindAsync(dto.CourseId);
        if (course == null)
        {
            return NotFound(new { error = "Course not found" });
        }

        // Check if seats are available
        if (course.SeatsAvailable == false)
        {
            return BadRequest(new { error = "No seats available in this course" });
        }

        // Check if already enrolled
        bool alreadyEnrolled = await _db.Enrollments.AnyAsync(e =>
            e.StudentId == dto.StudentId &&
            e.CourseId == dto.CourseId &&
            e.IsActive == true);

        if (alreadyEnrolled)
        {
            return Conflict(new { error = "Already enrolled in this course" });
        }

        // Create enrollment record
        Enrollment enrollment = new Enrollment();
        enrollment.StudentId = dto.StudentId;
        enrollment.CourseId = dto.CourseId;
        enrollment.EnrollmentDate = DateTime.UtcNow;
        enrollment.IsActive = true;

        // Update seat count
        course.EnrolledCount = course.EnrolledCount + 1;
        if (course.EnrolledCount >= course.TotalSeats)
        {
            course.SeatsAvailable = false;
        }

        _db.Enrollments.Add(enrollment);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Enrolled successfully", enrollmentId = enrollment.EnrollmentId });
    }

    // FR7 - DELETE api/enrollments/drop
    // Drops (removes) a student from a course
    [HttpDelete("drop")]
    public async Task<IActionResult> Drop([FromBody] DropRequestDto dto)
    {
        // Find the active enrollment
        Enrollment? enrollment = await _db.Enrollments.FirstOrDefaultAsync(e =>
            e.StudentId == dto.StudentId &&
            e.CourseId == dto.CourseId &&
            e.IsActive == true);

        if (enrollment == null)
        {
            return NotFound(new { error = "Enrollment not found" });
        }

        // Mark as dropped
        enrollment.IsActive = false;
        enrollment.DropDate = DateTime.UtcNow;

        // Free up the seat
        Course? course = await _db.Courses.FindAsync(dto.CourseId);
        if (course != null)
        {
            if (course.EnrolledCount > 0)
            {
                course.EnrolledCount = course.EnrolledCount - 1;
            }
            course.SeatsAvailable = true;
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Course dropped successfully" });
    }
}
