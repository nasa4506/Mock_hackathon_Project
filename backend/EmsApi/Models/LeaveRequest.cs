namespace EmsApi.Models;

/// <summary>
/// Represents a leave application submitted by an Employee.
/// Workflow: Employee submits (Pending) → HR reviews → Approved or Rejected.
/// </summary>
public class LeaveRequest
{
    public int LeaveRequestId { get; set; }
    public int EmployeeId { get; set; }           // FK → Employees
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
    public DateTime AppliedOn { get; set; } = DateTime.UtcNow;
    public int? ReviewedBy { get; set; }            // FK → Users.UserId (HR who reviewed)
    public DateTime? ReviewedOn { get; set; }

    // Navigation property
    public Employee Employee { get; set; } = null!;
}
