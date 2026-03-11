namespace EmsApi.DTOs;

// ── Auth DTOs ──────────────────────────────────────────────────

/// <summary>POST /api/auth/login body</summary>
public record LoginRequest(string Username, string Password);

/// <summary>POST /api/auth/login response</summary>
public record LoginResponse(string Token, int UserId, string Username, string Role, int? EmployeeId);

/// <summary>POST /api/auth/register body</summary>
public record RegisterRequest(string Username, string Password, string Role, int? EmployeeId);

// ── Employee DTOs ──────────────────────────────────────────────

/// <summary>Response DTO for employee data (hides navigation props)</summary>
public record EmployeeDto(
    int EmployeeId, string FirstName, string LastName,
    string Email, string Phone, string Designation,
    string Department, string Status
);

/// <summary>POST /api/employees body</summary>
public record CreateEmployeeDto(
    string FirstName, string LastName, string Email,
    string Phone, string Designation, string Department
);

/// <summary>PUT /api/employees/{id} body</summary>
public record UpdateEmployeeDto(
    string? FirstName, string? LastName, string? Email,
    string? Phone, string? Designation, string? Department,
    string? Status
);

// ── Leave DTOs ─────────────────────────────────────────────────

/// <summary>POST /api/leaves body</summary>
public record CreateLeaveDto(int EmployeeId, string StartDate, string EndDate, string Reason);

/// <summary>PUT /api/leaves/{id}/status body</summary>
public record UpdateLeaveStatusDto(string Status); // "Approved" or "Rejected"

/// <summary>Response DTO for leave requests</summary>
public record LeaveDto(
    int LeaveRequestId, int EmployeeId, string? EmployeeName,
    string StartDate, string EndDate, string Reason, string Status
);

// ── Attendance DTOs ────────────────────────────────────────────

/// <summary>Single attendance record in a bulk upload</summary>
public record AttendanceUploadItem(int EmployeeId, string Date, string Status);

/// <summary>POST /api/attendance/upload body</summary>
public record AttendanceUploadDto(List<AttendanceUploadItem> Records);

/// <summary>Response DTO for attendance</summary>
public record AttendanceDto(int AttendanceId, int EmployeeId, string Date, string Status);
