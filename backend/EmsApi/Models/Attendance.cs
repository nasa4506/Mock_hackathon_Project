namespace EmsApi.Models;

/// <summary>
/// Daily attendance record for an employee.
/// HR uploads these records; Employees can only view their own.
/// </summary>
public class Attendance
{
    public int AttendanceId { get; set; }
    public int EmployeeId { get; set; }              // FK → Employees
    public DateTime Date { get; set; }
    public string Status { get; set; } = "Present";  // Present, Absent, Leave

    // Navigation property
    public Employee Employee { get; set; } = null!;
}
