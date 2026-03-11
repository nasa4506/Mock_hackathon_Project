namespace EmsApi.Models;

/// <summary>
/// Core employee profile managed by HR.
/// Contains personal info, department, designation, and audit timestamps.
/// Has 1-to-Many relationships with LeaveRequests and Attendance records.
/// </summary>
public class Employee
{
    public int EmployeeId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Status { get; set; } = "Active"; // Active, Inactive, Revoked

    // Audit fields — tracked automatically when HR creates/modifies records
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<LeaveRequest> LeaveRequests { get; set; } = [];
    public ICollection<Attendance> AttendanceRecords { get; set; } = [];
}
