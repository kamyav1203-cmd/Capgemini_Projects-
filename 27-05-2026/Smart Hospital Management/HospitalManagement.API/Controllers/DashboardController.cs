using HospitalManagement.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Controllers
{
    /*
        Provides analytics/statistics for admin dashboard.
    */

    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        /*
            Constructor Dependency Injection
        */
        public DashboardController(
            ApplicationDbContext context
        )
        {
            _context = context;
        }

        /*
            ---------------------------------------------------
            GET DASHBOARD STATISTICS
            ---------------------------------------------------
        */

        [Authorize(Roles = "Admin")]
        [HttpGet("statistics")]
        public async Task<IActionResult> GetStatistics()
        {
            var totalPatients =
                await _context.Patients.CountAsync();

            var totalDoctors =
                await _context.Doctors.CountAsync();

            var totalAppointments =
                await _context.Appointments.CountAsync();

            var totalBills =
                await _context.Bills.CountAsync();

            var totalEmergencies =
                await _context.EmergencyRequests.CountAsync();

            var totalMedicines =
                await _context.Medicines.CountAsync();

            var totalRevenue =
                await _context.Bills.SumAsync(
                    b => (decimal?)b.Amount
                ) ?? 0;

            return Ok(new
            {
                TotalPatients = totalPatients,

                TotalDoctors = totalDoctors,

                TotalAppointments = totalAppointments,

                TotalBills = totalBills,

                TotalEmergencies = totalEmergencies,

                TotalMedicines = totalMedicines,

                TotalRevenue = totalRevenue
            });
        }
    }
}