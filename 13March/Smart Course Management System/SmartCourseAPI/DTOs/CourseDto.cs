namespace SmartCourseAPI.DTOs;

// Data needed to create a new course (Admin only)
public class CourseCreateDto
{
    public string CourseName { get; set; } = "";
    public int DepartmentId { get; set; }
    public int Credits { get; set; }
    public int TotalSeats { get; set; } = 30;
}

// Data needed to update an existing course (Admin only)
public class CourseUpdateDto
{
    public string CourseName { get; set; } = "";
    public int DepartmentId { get; set; }
    public int Credits { get; set; }
    public int TotalSeats { get; set; }
}

// Data needed to enroll a student in a course
public class EnrollRequestDto
{
    public int StudentId { get; set; }
    public int CourseId { get; set; }
}

// Data needed to drop a course
public class DropRequestDto
{
    public int StudentId { get; set; }
    public int CourseId { get; set; }
}
