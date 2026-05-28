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
        Handles:
        - Appointment booking
        - Appointment retrieval
        - Appointment status updates
    */

    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly IHubContext<NotificationHub> _hubContext;

        private readonly IAuditService _auditService;

        /*
            Constructor Dependency Injection
        */
        public AppointmentController(
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
            BOOK APPOINTMENT
            ---------------------------------------------------

            Only:
            - Patient
            - Admin

            can create appointments.
        */

        [Authorize(Roles = "Patient,Admin")]
        [HttpPost("book")]
        public async Task<IActionResult> BookAppointment(
            CreateAppointmentDto model
        )
        {
            /*
                Validate patient existence
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
                Validate doctor existence
            */
            var doctor =
                await _context.Doctors
                    .Include(d => d.User)
                    .FirstOrDefaultAsync(
                        d => d.Id == model.DoctorId
                    );

            if (doctor == null)
            {
                return BadRequest(new
                {
                    Message = "Doctor not found."
                });
            }

            /*
                Prevent appointment conflicts.
            */
            bool conflictExists =
                await _context.Appointments.AnyAsync(a =>
                    a.DoctorId == model.DoctorId
                    &&
                    a.AppointmentDate == model.AppointmentDate
                );

            if (conflictExists)
            {
                return BadRequest(new
                {
                    Message =
                        "Appointment slot already booked."
                });
            }

            /*
                Create appointment entity
            */
            var appointment = new Appointment
            {
                PatientId = model.PatientId,
                DoctorId = model.DoctorId,
                AppointmentDate = model.AppointmentDate,
                Symptoms = model.Symptoms,
                Status = "Pending"
            };

            _context.Appointments.Add(appointment);

            await _context.SaveChangesAsync();

            /*
                Audit logging
            */
            await _auditService.LogActivity(
                patient.UserId,
                $"Booked appointment with Doctor ID {doctor.Id}"
            );

            /*
                Realtime SignalR notification
            */
            await _hubContext.Clients.All.SendAsync(
                "ReceiveNotification",
                $"New appointment booked for Dr. {doctor.User?.FullName}"
            );

            /*
                Return response DTO
            */
            return Ok(new AppointmentResponseDto
            {
                Id = appointment.Id,
                PatientName =
                    patient.User?.FullName ?? "Unknown",
                DoctorName =
                    doctor.User?.FullName ?? "Unknown",
                AppointmentDate =
                    appointment.AppointmentDate,
                Status = appointment.Status,
                Symptoms = appointment.Symptoms
            });
        }

        /*
            ---------------------------------------------------
            GET ALL APPOINTMENTS
            ---------------------------------------------------

            Accessible by:
            - Admin
            - Doctor
        */

        [Authorize(Roles = "Admin,Doctor")]
        [HttpGet]
        public async Task<IActionResult> GetAppointments()
        {
            var appointments =
                await _context.Appointments
                    .Include(a => a.Patient)
                        .ThenInclude(p => p.User)
                    .Include(a => a.Doctor)
                        .ThenInclude(d => d.User)
                    .Select(a => new AppointmentResponseDto
                    {
                        Id = a.Id,

                        PatientName =
                            a.Patient!.User!.FullName,

                        DoctorName =
                            a.Doctor!.User!.FullName,

                        AppointmentDate =
                            a.AppointmentDate,

                        Status = a.Status,

                        Symptoms = a.Symptoms
                    })
                    .ToListAsync();

            return Ok(appointments);
        }

        /*
            ---------------------------------------------------
            UPDATE APPOINTMENT STATUS
            ---------------------------------------------------

            Only Doctor/Admin can update.
        */

        [Authorize(Roles = "Doctor,Admin")]
        [HttpPut("update-status/{id}")]
        public async Task<IActionResult> UpdateStatus(
            int id,
            [FromQuery] string status
        )
        {
            var appointment =
                await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound(new
                {
                    Message = "Appointment not found."
                });
            }

            appointment.Status = status;

            await _context.SaveChangesAsync();

            /*
                SignalR realtime update
            */
            await _hubContext.Clients.All.SendAsync(
                "ReceiveNotification",
                $"Appointment #{appointment.Id} updated to {status}"
            );

            return Ok(new
            {
                Message =
                    $"Appointment status updated to {status}"
            });
        }
    }
}