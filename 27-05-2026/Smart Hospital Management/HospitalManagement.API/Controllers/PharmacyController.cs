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
        Handles pharmacy medicine inventory.
    */

    [Route("api/[controller]")]
    [ApiController]
    public class PharmacyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly IAuditService _auditService;

        /*
            Constructor Dependency Injection
        */
        public PharmacyController(
            ApplicationDbContext context,
            IAuditService auditService
        )
        {
            _context = context;
            _auditService = auditService;
        }

        /*
            ---------------------------------------------------
            ADD MEDICINE
            ---------------------------------------------------
        */

        [Authorize(Roles = "Admin,Pharmacist")]
        [HttpPost]
        public async Task<IActionResult> AddMedicine(
            CreateMedicineDto model
        )
        {
            /*
                Create medicine entity
            */
            var medicine = new Medicine
            {
                Name = model.Name,
                Manufacturer = model.Manufacturer,
                Price = model.Price,
                StockQuantity = model.StockQuantity,
                ExpiryDate = model.ExpiryDate
            };

            _context.Medicines.Add(medicine);

            await _context.SaveChangesAsync();

            /*
                Audit logging
            */
            await _auditService.LogActivity(
                "SYSTEM",
                $"Medicine added: {medicine.Name}"
            );

            return Ok(new
            {
                Message = "Medicine added successfully.",
                MedicineId = medicine.Id
            });
        }

        /*
            ---------------------------------------------------
            GET ALL MEDICINES
            ---------------------------------------------------
        */

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetMedicines()
        {
            var medicines =
                await _context.Medicines
                    .Select(m => new
                    {
                        m.Id,
                        m.Name,
                        m.Manufacturer,
                        m.Price,
                        m.StockQuantity,
                        m.ExpiryDate
                    })
                    .ToListAsync();

            return Ok(medicines);
        }

        /*
            ---------------------------------------------------
            UPDATE STOCK
            ---------------------------------------------------
        */

        [Authorize(Roles = "Admin,Pharmacist")]
        [HttpPut("update-stock/{id}")]
        public async Task<IActionResult> UpdateStock(
            int id,
            [FromQuery] int quantity
        )
        {
            var medicine =
                await _context.Medicines.FindAsync(id);

            if (medicine == null)
            {
                return NotFound(new
                {
                    Message = "Medicine not found."
                });
            }

            medicine.StockQuantity = quantity;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Medicine stock updated."
            });
        }
    }
}