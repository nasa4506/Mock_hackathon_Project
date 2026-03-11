using EmsApi.Data;
using EmsApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmsApi.Controllers;

/// <summary>
/// Leave request endpoints implementing the approval workflow:
///   Employee submits → Status = "Pending"
///   HR reviews → Status = "Approved" or "Rejected"
///
/// Maps to the Angular LeaveService on the frontend.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize] // All actions require a valid JWT token
public class LeavesController : ControllerBase
{
    private readonly AppDbContext _db;

    public LeavesController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/leaves
    // Returns ALL leave requests with employee names. HR only.
    [HttpGet]
    [Authorize(Roles = "HR")]
    public async Task<IActionResult> GetAll()
    {
        var leaves = await _db.LeaveRequests
            .Include(l => l.Employee) // Join to get employee name
            .Select(l => new LeaveDto(
                l.LeaveRequestId,
                l.EmployeeId,
                l.Employee.FirstName + " " + l.Employee.LastName,
                l.StartDate.ToString("yyyy-MM-dd"),
                l.EndDate.ToString("yyyy-MM-dd"),
                l.Reason,
                l.Status))
            .ToListAsync();

        return Ok(leaves);
    }

    // GET /api/leaves/employee/{empId}
    // Returns leave requests for a specific employee.
    [HttpGet("employee/{empId:int}")]
    public async Task<IActionResult> GetByEmployee(int empId)
    {
        var leaves = await _db.LeaveRequests
            .Where(l => l.EmployeeId == empId)
            .Include(l => l.Employee)
            .Select(l => new LeaveDto(
                l.LeaveRequestId,
                l.EmployeeId,
                l.Employee.FirstName + " " + l.Employee.LastName,
                l.StartDate.ToString("yyyy-MM-dd"),
                l.EndDate.ToString("yyyy-MM-dd"),
                l.Reason,
                l.Status))
            .ToListAsync();

        return Ok(leaves);
    }

    // POST /api/leaves
    // Employee submits a new leave request. Defaults to "Pending".
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLeaveDto dto)
    {
        // Validate the employee exists
        var empExists = await _db.Employees.AnyAsync(e => e.EmployeeId == dto.EmployeeId);
        if (!empExists)
            return BadRequest(new { message = "Employee not found." });

        var leave = new Models.LeaveRequest
        {
            EmployeeId = dto.EmployeeId,
            StartDate = DateTime.Parse(dto.StartDate),
            EndDate = DateTime.Parse(dto.EndDate),
            Reason = dto.Reason,
            Status = "Pending",
            AppliedOn = DateTime.UtcNow
        };

        _db.LeaveRequests.Add(leave);
        await _db.SaveChangesAsync();

        var result = new LeaveDto(
            leave.LeaveRequestId, leave.EmployeeId, null,
            leave.StartDate.ToString("yyyy-MM-dd"),
            leave.EndDate.ToString("yyyy-MM-dd"),
            leave.Reason, leave.Status);

        return Created($"/api/leaves/{leave.LeaveRequestId}", result);
    }

    // PUT /api/leaves/{id}/status
    // HR approves or rejects a pending leave request. HR only.
    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "HR")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateLeaveStatusDto dto)
    {
        var leave = await _db.LeaveRequests.FindAsync(id);
        if (leave is null)
            return NotFound(new { message = "Leave request not found." });

        // Only allow valid status transitions
        if (dto.Status != "Approved" && dto.Status != "Rejected")
            return BadRequest(new { message = "Status must be 'Approved' or 'Rejected'." });

        leave.Status = dto.Status;
        leave.ReviewedOn = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new { leave.LeaveRequestId, leave.Status });
    }
}
