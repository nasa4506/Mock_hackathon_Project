using EmsApi.Models;

namespace EmsApi.Data;

/// <summary>
/// Seeds the InMemory database with mock data that matches
/// the Angular frontend's existing mock data exactly.
/// This ensures a smooth transition when the frontend swaps
/// from local signals to real HTTP calls.
/// </summary>
public static class SeedData
{
    public static void Initialize(AppDbContext db)
    {
        // Avoid re-seeding if data already exists
        if (db.Users.Any()) return;

        // ── Employees ──────────────────────────────────────────
        var employees = new List<Employee>
        {
            new()
            {
                EmployeeId = 101,
                FirstName = "John",
                LastName = "Doe",
                Email = "john@example.com",
                Phone = "1234567890",
                Designation = "Developer",
                Department = "IT",
                Status = "Active"
            },
            new()
            {
                EmployeeId = 102,
                FirstName = "Jane",
                LastName = "Smith",
                Email = "jane@example.com",
                Phone = "0987654321",
                Designation = "Manager",
                Department = "HR",
                Status = "Active"
            }
        };
        db.Employees.AddRange(employees);

        // ── Users (login credentials) ──────────────────────────
        // Passwords are stored as plain text for Phase 1 mock.
        // In production, these would be BCrypt hashes.
        var users = new List<User>
        {
            new()
            {
                UserId = 1,
                Username = "admin_hr",
                PasswordHash = "123",  // Mock password
                Role = "HR",
                EmployeeId = null      // HR-only account, no employee profile
            },
            new()
            {
                UserId = 2,
                Username = "emp_john",
                PasswordHash = "123",  // Mock password
                Role = "Employee",
                EmployeeId = 101       // Links to John Doe's employee record
            }
        };
        db.Users.AddRange(users);

        // ── Leave Requests ─────────────────────────────────────
        db.LeaveRequests.Add(new LeaveRequest
        {
            LeaveRequestId = 1,
            EmployeeId = 101,
            StartDate = new DateTime(2026, 3, 1),
            EndDate = new DateTime(2026, 3, 3),
            Reason = "Vacation",
            Status = "Pending",
            AppliedOn = DateTime.UtcNow
        });

        // ── Attendance ─────────────────────────────────────────
        db.AttendanceRecords.Add(new Attendance
        {
            AttendanceId = 1,
            EmployeeId = 101,
            Date = new DateTime(2026, 2, 28),
            Status = "Present"
        });

        db.SaveChanges();
    }
}
