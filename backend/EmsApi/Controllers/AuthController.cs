using EmsApi.DTOs;
using EmsApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmsApi.Controllers;

/// <summary>
/// Handles user authentication (login) and registration.
/// 
/// Authentication Flow:
/// 1. Client sends POST /api/auth/login with { username, password }
/// 2. AuthService validates credentials against the Users table
/// 3. AuthService generates a JWT token with userId, username, role, employeeId claims
/// 4. Client stores the token in localStorage
/// 5. Client sends the token as "Authorization: Bearer {token}" on every subsequent request
/// 6. ASP.NET Core middleware validates the token and populates HttpContext.User
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    // IAuthService is injected via constructor DI
    // Registered in Program.cs as: builder.Services.AddScoped<IAuthService, AuthService>()
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // POST /api/auth/login
    // Accepts: { username, password }
    // Returns: { token, userId, username, role, employeeId }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var result = await _authService.LoginAsync(req);

        if (result is null)
            return BadRequest(new { message = "Invalid username or password." });

        return Ok(result);
    }

    // POST /api/auth/register
    // Accepts: { username, password, role, employeeId? }
    // Returns: 201 Created with the new user info
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        var result = await _authService.RegisterAsync(req);

        if (result is null)
            return BadRequest(new { message = "Username already exists." });

        return CreatedAtAction(nameof(Login), result);
    }
}
