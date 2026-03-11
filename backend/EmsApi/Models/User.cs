namespace EmsApi.Models;

/// <summary>
/// Represents a login credential in the system.
/// Each User has a Role (HR or Employee) that controls dashboard access.
/// If the user is an Employee, EmployeeId links them to their profile.
/// </summary>
public class User
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty; // BCrypt hash in production
    public string Role { get; set; } = "Employee";           // "HR" or "Employee"
    public int? EmployeeId { get; set; }                     // FK → Employees (null for pure HR accounts)

    // Navigation property
    public Employee? Employee { get; set; }
}
