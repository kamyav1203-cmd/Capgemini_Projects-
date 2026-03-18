namespace SmartCourseAPI.Models;

public class Course
{
    public int CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public int Credits { get; set; }
    public bool SeatsAvailable { get; set; } = true;
    public int TotalSeats { get; set; } = 30;
    public int EnrolledCount { get; set; } = 0;

    public Department? Department { get; set; }
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
