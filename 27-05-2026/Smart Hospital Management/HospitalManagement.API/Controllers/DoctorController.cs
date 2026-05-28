using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Interfaces;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Controllers
{
    /*
        Handles doctor management APIs.
    */

    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly IAuditService _auditService;

        /*
            Constructor Dependency Injection
        */
        public DoctorController(
            ApplicationDbContext context,
            IAuditService auditService
        )
        {
            _context = context;
            _auditService = auditService;
        }

        /*
            ---------------------------------------------------
            CREATE DOCTOR
            ---------------------------------------------------

            Accessible only by Admin.
        */

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateDoctor(
            CreateDoctorDto model
        )
        {
            /*
                Validate linked Identity user
            */
            var user =
                await _context.Users
                    .FirstOrDefaultAsync(
                        u => u.Id == model.UserId
                    );

            if (user == null)
            {
                return BadRequest(new
                {
                    Message = "User not found."
                });
            }

            /*
                Prevent duplicate doctor records
            */
            bool doctorExists =
                await _context.Doctors.AnyAsync(
                    d => d.UserId == model.UserId
                );

            if (doctorExists)
            {
                return BadRequest(new
                {
                    Message = "Doctor already exists."
                });
            }

            /*
                Create doctor entity
            */
            var doctor = new Doctor
            {
                UserId = model.UserId,
                Specialization =
                    model.Specialization,
                ExperienceYears =
                    model.ExperienceYears,
                ConsultationFee =
                    model.ConsultationFee,
                IsAvailable = true
            };

            _context.Doctors.Add(doctor);

            await _context.SaveChangesAsync();

            /*
                Audit logging
            */
            await _auditService.LogActivity(
                user.Id,
                "Doctor profile created."
            );

            return Ok(new
            {
                Message = "Doctor created successfully.",
                DoctorId = doctor.Id
            });
        }

        /*
            ---------------------------------------------------
            GET ALL DOCTORS
            ---------------------------------------------------
        */

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetDoctors()
        {
            var doctors =
                await _context.Doctors
                    .Include(d => d.User)
                    .Select(d => new
                    {
                        d.Id,

                        FullName =
                            d.User!.FullName,

                        d.Specialization,

                        d.ExperienceYears,

                        d.ConsultationFee,

                        d.IsAvailable
                    })
                    .ToListAsync();

            return Ok(doctors);
        }
    }
}