using EmsApi.Data;
using EmsApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmsApi.Controllers;

/// <summary>
/// CRUD operations for Employee records.
/// 
/// Access control:
/// - GET (all): HR only — see the full employee directory.
/// - GET (by id): Any authenticated user — employees can view their own profile.
/// - POST / PUT / DELETE: HR only — manage the workforce.
///
/// Maps to the Angular EmployeeService on the frontend.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize] // All actions require a valid JWT token
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _db;

    public EmployeesController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/employees
    // Returns all employees. HR only.
    [HttpGet]
    [Authorize(Roles = "HR")]
    public async Task<IActionResult> GetAll()
    {
        var employees = await _db.Employees
            .Select(e => new EmployeeDto(
                e.EmployeeId, e.FirstName, e.LastName,
                e.Email, e.Phone, e.Designation,
                e.Department, e.Status))
            .ToListAsync();

        return Ok(employees);
    }

    // GET /api/employees/{id}
    // Returns a single employee by ID.
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var emp = await _db.Employees.FindAsync(id);
        if (emp is null) return NotFound(new { message = "Employee not found." });

        return Ok(new EmployeeDto(
            emp.EmployeeId, emp.FirstName, emp.LastName,
            emp.Email, emp.Phone, emp.Designation,
            emp.Department, emp.Status));
    }

    // POST /api/employees
    // Creates a new employee record. HR only.
    [HttpPost]
    [Authorize(Roles = "HR")]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
    {
        var employee = new Models.Employee
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            Designation = dto.Designation,
            Department = dto.Department,
            Status = "Active"
        };

        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();

        var result = new EmployeeDto(
            employee.EmployeeId, employee.FirstName, employee.LastName,
            employee.Email, employee.Phone, employee.Designation,
            employee.Department, employee.Status);

        return CreatedAtAction(nameof(GetById), new { id = employee.EmployeeId }, result);
    }

    // PUT /api/employees/{id}
    // Updates an existing employee. HR only.
    [HttpPut("{id:int}")]
    [Authorize(Roles = "HR")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto dto)
    {
        var emp = await _db.Employees.FindAsync(id);
        if (emp is null) return NotFound(new { message = "Employee not found." });

        // Only update fields that were provided (non-null)
        if (dto.FirstName is not null) emp.FirstName = dto.FirstName;
        if (dto.LastName is not null) emp.LastName = dto.LastName;
        if (dto.Email is not null) emp.Email = dto.Email;
        if (dto.Phone is not null) emp.Phone = dto.Phone;
        if (dto.Designation is not null) emp.Designation = dto.Designation;
        if (dto.Department is not null) emp.Department = dto.Department;
        if (dto.Status is not null) emp.Status = dto.Status;
        emp.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new EmployeeDto(
            emp.EmployeeId, emp.FirstName, emp.LastName,
            emp.Email, emp.Phone, emp.Designation,
            emp.Department, emp.Status));
    }

    // DELETE /api/employees/{id}
    // Removes an employee. HR only.
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "HR")]
    public async Task<IActionResult> Delete(int id)
    {
        var emp = await _db.Employees.FindAsync(id);
        if (emp is null) return NotFound(new { message = "Employee not found." });

        _db.Employees.Remove(emp);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
