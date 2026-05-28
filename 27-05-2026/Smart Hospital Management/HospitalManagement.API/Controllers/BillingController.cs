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
        Handles:
        - Bill generation
        - Payment tracking
    */

    [Route("api/[controller]")]
    [ApiController]
    public class BillingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly IAuditService _auditService;

        /*
            Constructor Dependency Injection
        */
        public BillingController(
            ApplicationDbContext context,
            IAuditService auditService
        )
        {
            _context = context;
            _auditService = auditService;
        }

        /*
            ---------------------------------------------------
            CREATE BILL
            ---------------------------------------------------

            Accessible by:
            - Admin
            - Receptionist
        */

        [Authorize(Roles = "Admin,Receptionist")]
        [HttpPost]
        public async Task<IActionResult> CreateBill(
            CreateBillDto model
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
                Create billing entity
            */
            var bill = new Bill
            {
                PatientId = model.PatientId,
                Amount = model.Amount,
                PaymentMethod = model.PaymentMethod,
                PaymentStatus = "Paid",
                BillingDate = DateTime.UtcNow
            };

            _context.Bills.Add(bill);

            await _context.SaveChangesAsync();

            /*
                Audit logging
            */
            await _auditService.LogActivity(
                patient.UserId,
                $"Bill generated: ₹{bill.Amount}"
            );

            return Ok(new
            {
                Message = "Bill created successfully.",
                BillId = bill.Id
            });
        }

        /*
            ---------------------------------------------------
            GET ALL BILLS
            ---------------------------------------------------
        */

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetBills()
        {
            var bills =
                await _context.Bills
                    .Include(b => b.Patient)
                        .ThenInclude(p => p.User)
                    .Select(b => new
                    {
                        b.Id,

                        PatientName =
                            b.Patient!.User!.FullName,

                        b.Amount,

                        b.PaymentMethod,

                        b.PaymentStatus,

                        b.BillingDate
                    })
                    .ToListAsync();

            return Ok(bills);
        }
    }
}