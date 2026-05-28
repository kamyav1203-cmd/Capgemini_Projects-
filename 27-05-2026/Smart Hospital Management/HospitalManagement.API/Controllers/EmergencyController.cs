using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Hubs;
using HospitalManagement.API.Interfaces;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Controllers
{
    /*
        Handles emergency patient requests.
    */

    [Route("api/[controller]")]
    [ApiController]
    public class EmergencyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly IHubContext<NotificationHub> _hubContext;

        private readonly IAuditService _auditService;

        /*
            Constructor Dependency Injection
        */
        public EmergencyController(
            ApplicationDbContext context,
            IHubContext<NotificationHub> hubContext,
            IAuditService auditService
        )
        {
            _context = context;
            _hubContext = hubContext;
            _auditService = auditService;
        }

        /*
            ---------------------------------------------------
            CREATE EMERGENCY REQUEST
            ---------------------------------------------------
        */

        [Authorize(Roles = "Patient,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateEmergency(
            CreateEmergencyRequestDto model
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
                Create emergency request
            */
            var emergency = new EmergencyRequest
            {
                PatientId = model.PatientId,
                Description = model.Description,
                Location = model.Location,
                Status = "Active",
                RequestedAt = DateTime.UtcNow
            };

            _context.EmergencyRequests.Add(emergency);

            await _context.SaveChangesAsync();

            /*
                Audit logging
            */
            await _auditService.LogActivity(
                patient.UserId,
                "Emergency request created."
            );

            /*
                SignalR realtime emergency alert
            */
            await _hubContext.Clients.All.SendAsync(
                "ReceiveNotification",
                $"🚨 Emergency Alert from {patient.User!.FullName}"
            );

            return Ok(new
            {
                Message = "Emergency request submitted.",
                EmergencyId = emergency.Id
            });
        }

        /*
            ---------------------------------------------------
            GET EMERGENCY REQUESTS
            ---------------------------------------------------
        */

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetEmergencies()
        {
            var emergencies =
                await _context.EmergencyRequests
                    .Include(e => e.Patient)
                        .ThenInclude(p => p.User)
                    .Select(e => new
                    {
                        e.Id,

                        PatientName =
                            e.Patient!.User!.FullName,

                        e.Description,

                        e.Location,

                        e.Status,

                        e.RequestedAt
                    })
                    .ToListAsync();

            return Ok(emergencies);
        }
    }
}