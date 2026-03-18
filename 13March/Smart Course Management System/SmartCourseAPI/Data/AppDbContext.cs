using Microsoft.EntityFrameworkCore;
using SmartCourseAPI.Models;

namespace SmartCourseAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Student> Students => Set<Student>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Unique email
        modelBuilder.Entity<Student>()
            .HasIndex(s => s.Email)
            .IsUnique();

        // One student can enroll in a course only once (active)
        modelBuilder.Entity<Enrollment>()
            .HasIndex(e => new { e.StudentId, e.CourseId, e.IsActive });

        // Seed Departments
        modelBuilder.Entity<Department>().HasData(
            new Department { DepartmentId = 1, DepartmentName = "Computer Science" },
            new Department { DepartmentId = 2, DepartmentName = "Data Science" },
            new Department { DepartmentId = 3, DepartmentName = "Information Technology" },
            new Department { DepartmentId = 4, DepartmentName = "Software Engineering" },
            new Department { DepartmentId = 5, DepartmentName = "Cybersecurity" }
        );

        // Seed Students — passwords are BCrypt hashes of "Admin@123", "Student@123"
        // Admin@123  => seeded admin password
        // Student@123 => seeded student password
        const string adminHash   = "$2a$11$Aam20HCcvhAJuRZVvFHm/uYkMFGsDPEeiSAxlaoTTTJOA2NVfyPAm";
        const string studentHash = "$2a$11$mzLUjQg3jQyEEgnRD0oSYOoqo926M6.N8bCSI12tHUWveWWhkP8ee";
        modelBuilder.Entity<Student>().HasData(
            new Student { StudentId = 1, Name = "Admin User",    Email = "admin@smartcourse.com",  Phone = "9000000000", Role = "Admin",   PasswordHash = adminHash },
            new Student { StudentId = 2, Name = "Alice Johnson", Email = "alice@smartcourse.com",  Phone = "9111111111", Role = "Student", PasswordHash = studentHash },
            new Student { StudentId = 3, Name = "Bob Smith",     Email = "bob@smartcourse.com",    Phone = "9222222222", Role = "Student", PasswordHash = studentHash },
            new Student { StudentId = 4, Name = "Carol White",   Email = "carol@smartcourse.com",  Phone = "9333333333", Role = "Student", PasswordHash = studentHash }
        );

        // Seed Courses
        modelBuilder.Entity<Course>().HasData(
            new Course { CourseId = 1, CourseName = "JavaScript Fundamentals",  DepartmentId = 1, Credits = 3, TotalSeats = 30, EnrolledCount = 0, SeatsAvailable = true },
            new Course { CourseId = 2, CourseName = "React & Redux",            DepartmentId = 4, Credits = 4, TotalSeats = 25, EnrolledCount = 0, SeatsAvailable = true },
            new Course { CourseId = 3, CourseName = "ASP.NET Core Web API",     DepartmentId = 4, Credits = 4, TotalSeats = 20, EnrolledCount = 0, SeatsAvailable = true },
            new Course { CourseId = 4, CourseName = "Python for Data Science",  DepartmentId = 2, Credits = 5, TotalSeats = 35, EnrolledCount = 0, SeatsAvailable = true },
            new Course { CourseId = 5, CourseName = "Database Design & SQL",    DepartmentId = 1, Credits = 3, TotalSeats = 25, EnrolledCount = 0, SeatsAvailable = true },
            new Course { CourseId = 6, CourseName = "Machine Learning Basics",  DepartmentId = 2, Credits = 5, TotalSeats = 30, EnrolledCount = 0, SeatsAvailable = true },
            new Course { CourseId = 7, CourseName = "Network Security",         DepartmentId = 5, Credits = 4, TotalSeats = 20, EnrolledCount = 0, SeatsAvailable = true },
            new Course { CourseId = 8, CourseName = "Cloud Computing & DevOps", DepartmentId = 3, Credits = 4, TotalSeats = 25, EnrolledCount = 0, SeatsAvailable = true }
        );
    }
}
