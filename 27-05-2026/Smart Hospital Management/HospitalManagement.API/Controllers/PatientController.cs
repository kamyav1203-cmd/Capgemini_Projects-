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
        Handles patient management APIs.
    */

    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly IAuditService _auditService;

        /*
            Constructor Dependency Injection
        */
        public PatientController(
            ApplicationDbContext context,
            IAuditService auditService
        )
        {
            _context = context;
            _auditService = auditService;
        }

        /*
            ---------------------------------------------------
            CREATE PATIENT
            ---------------------------------------------------

            Accessible by:
            - Admin
            - Receptionist
        */

        [Authorize(Roles = "Admin,Receptionist")]
        [HttpPost]
        public async Task<IActionResult> CreatePatient(
            CreatePatientDto model
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
                Prevent duplicate patient records
            */
            bool patientExists =
                await _context.Patients.AnyAsync(
                    p => p.UserId == model.UserId
                );

            if (patientExists)
            {
                return BadRequest(new
                {
                    Message = "Patient already exists."
                });
            }

            /*
                Create patient entity
            */
            var patient = new Patient
            {
                UserId = model.UserId,
                Age = model.Age,
                Gender = model.Gender,
                BloodGroup = model.BloodGroup,
                EmergencyContact =
                    model.EmergencyContact,
                MedicalHistory =
                    model.MedicalHistory
            };

            _context.Patients.Add(patient);

            await _context.SaveChangesAsync();

            /*
                Audit logging
            */
            await _auditService.LogActivity(
                user.Id,
                "Patient profile created."
            );

            return Ok(new
            {
                Message = "Patient created successfully.",
                PatientId = patient.Id
            });
        }

        /*
            ---------------------------------------------------
            GET ALL PATIENTS
            ---------------------------------------------------
        */

        [Authorize(Roles = "Admin,Doctor")]
        [HttpGet]
        public async Task<IActionResult> GetPatients()
        {
            var patients =
                await _context.Patients
                    .Include(p => p.User)
                    .Select(p => new
                    {
                        p.Id,

                        FullName =
                            p.User!.FullName,

                        p.Age,

                        p.Gender,

                        p.BloodGroup,

                        p.EmergencyContact,

                        p.MedicalHistory
                    })
                    .ToListAsync();

            return Ok(patients);
        }
    }
}