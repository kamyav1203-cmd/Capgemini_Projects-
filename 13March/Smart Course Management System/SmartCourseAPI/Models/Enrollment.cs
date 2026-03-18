namespace SmartCourseAPI.Models;

public class Enrollment
{
    public int EnrollmentId { get; set; }
    public int CourseId { get; set; }
    public int StudentId { get; set; }
    public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;
    public DateTime? DropDate { get; set; }
    public bool IsActive { get; set; } = true;

    public Course? Course { get; set; }
    public Student? Student { get; set; }
}
