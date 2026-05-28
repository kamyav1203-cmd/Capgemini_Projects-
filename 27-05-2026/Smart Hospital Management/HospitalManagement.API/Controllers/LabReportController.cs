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
        Handles lab report operations.
    */

    [Route("api/[controller]")]
    [ApiController]
    public class LabReportController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly IAuditService _auditService;

        /*
            Constructor Dependency Injection
        */
        public LabReportController(
            ApplicationDbContext context,
            IAuditService auditService
        )
        {
            _context = context;
            _auditService = auditService;
        }

        /*
            ---------------------------------------------------
            CREATE LAB REPORT
            ---------------------------------------------------
        */

        [Authorize(Roles = "Admin,LabTechnician")]
        [HttpPost]
        public async Task<IActionResult> CreateLabReport(
            CreateLabReportDto model
        )
        {
            /*
                Validate patient
            */
            var patient =
                await _context.Patients
                    .Include(p => p.User)
                    .FirstOrDefaultAsync(
                        p => p.Id == model.PatientId
                    );

            if (patient == null)
            {
                return BadRequest(new
                {
                    Message = "Patient not found."
                });
            }

            /*
                Create report
            */
            var report = new LabReport
            {
                PatientId = model.PatientId,
                TestName = model.TestName,
                Result = model.Result,
                FilePath = model.FilePath,
                UploadedAt = DateTime.UtcNow
            };

            _context.LabReports.Add(report);

            await _context.SaveChangesAsync();

            /*
                Audit logging
            */
            await _auditService.LogActivity(
                patient.UserId,
                $"Lab report uploaded: {report.TestName}"
            );

            return Ok(new
            {
                Message = "Lab report uploaded successfully.",
                ReportId = report.Id
            });
        }

        /*
            ---------------------------------------------------
            GET LAB REPORTS
            ---------------------------------------------------
        */

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetReports()
        {
            var reports =
                await _context.LabReports
                    .Include(r => r.Patient)
                        .ThenInclude(p => p.User)
                    .Select(r => new
                    {
                        r.Id,

                        PatientName =
                            r.Patient!.User!.FullName,

                        r.TestName,

                        r.Result,

                        r.FilePath,

                        r.UploadedAt
                    })
                    .ToListAsync();

            return Ok(reports);
        }
    }
}