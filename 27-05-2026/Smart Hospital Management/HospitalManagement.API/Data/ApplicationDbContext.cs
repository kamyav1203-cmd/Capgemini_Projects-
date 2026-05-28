using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Data
{
    /*
        ApplicationDbContext is the main bridge between
        ASP.NET Core application and SQL Server database.

        It manages:
        - Identity tables
        - Application tables
        - Relationships
        - Entity configurations
    */

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        /*
            Constructor receives DbContext options from Program.cs
        */
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        /*
            DbSets represent database tables.
        */

        public DbSet<Branch> Branches { get; set; }

        public DbSet<Patient> Patients { get; set; }

        public DbSet<Doctor> Doctors { get; set; }

        public DbSet<Appointment> Appointments { get; set; }

        public DbSet<Prescription> Prescriptions { get; set; }

        public DbSet<LabReport> LabReports { get; set; }

        public DbSet<Bill> Bills { get; set; }

        public DbSet<EmergencyRequest> EmergencyRequests { get; set; }

        public DbSet<AuditLog> AuditLogs { get; set; }

        public DbSet<Medicine> Medicines { get; set; }

        /*
            Configure entity relationships and constraints.
        */
        protected override void OnModelCreating(ModelBuilder builder)
        {
            // IMPORTANT:
            // Always call base first when using Identity
            base.OnModelCreating(builder);

            /*
                Appointment Relationships
            */

            builder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany()
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany()
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            /*
                Prescription Relationships
            */

            builder.Entity<Prescription>()
                .HasOne(p => p.Appointment)
                .WithMany()
                .HasForeignKey(p => p.AppointmentId);

            /*
                Lab Report Relationships
            */

            builder.Entity<LabReport>()
                .HasOne(l => l.Patient)
                .WithMany()
                .HasForeignKey(l => l.PatientId);

            /*
                Billing Relationships
            */

            builder.Entity<Bill>()
                .HasOne(b => b.Patient)
                .WithMany()
                .HasForeignKey(b => b.PatientId);

            /*
                Emergency Request Relationships
            */

            builder.Entity<EmergencyRequest>()
                .HasOne(e => e.Patient)
                .WithMany()
                .HasForeignKey(e => e.PatientId);
        }
    }
}