using EmsApi.Data;
using EmsApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmsApi.Controllers;

/// <summary>
/// Attendance tracking endpoints.
/// - HR uploads bulk attendance data for employees.
/// - Employees view their own attendance records.
///
/// Maps to the Angular AttendanceService on the frontend.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize] // All actions require a valid JWT token
public class AttendanceController : ControllerBase
{
    private readonly AppDbContext _db;

    public AttendanceController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/attendance/employee/{empId}
    // Returns all attendance records for a specific employee.
    [HttpGet("employee/{empId:int}")]
    public async Task<IActionResult> GetByEmployee(int empId)
    {
        var records = await _db.AttendanceRecords
            .Where(a => a.EmployeeId == empId)
            .OrderByDescending(a => a.Date)
            .Select(a => new AttendanceDto(
                a.AttendanceId, a.EmployeeId,
                a.Date.ToString("yyyy-MM-dd"),
                a.Status))
            .ToListAsync();

        return Ok(records);
    }

    // POST /api/attendance/upload
    // HR uploads one or more attendance records in bulk.
    [HttpPost("upload")]
    [Authorize(Roles = "HR")]
    public async Task<IActionResult> Upload([FromBody] AttendanceUploadDto dto)
    {
        if (dto.Records is null || dto.Records.Count == 0)
            return BadRequest(new { message = "No records provided." });

        var attendanceRecords = dto.Records.Select(r => new Models.Attendance
        {
            EmployeeId = r.EmployeeId,
            Date = DateTime.Parse(r.Date),
            Status = r.Status
        }).ToList();

        _db.AttendanceRecords.AddRange(attendanceRecords);
        await _db.SaveChangesAsync();

        return Created("/api/attendance",
            new { message = $"{attendanceRecords.Count} records uploaded.", count = attendanceRecords.Count });
    }
}
