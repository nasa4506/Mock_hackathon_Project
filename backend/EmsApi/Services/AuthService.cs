using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EmsApi.Data;
using EmsApi.DTOs;
using EmsApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace EmsApi.Services;

/// <summary>
/// Concrete implementation of IAuthService.
/// Handles credential validation, JWT generation, and user registration.
/// 
/// Injected into AuthController via constructor DI:
///   public AuthController(IAuthService authService) { ... }
///
/// Registered in Program.cs:
///   builder.Services.AddScoped&lt;IAuthService, AuthService&gt;();
/// </summary>
public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    /// <summary>
    /// Validates username/password against the Users table.
    /// If valid, generates a JWT token and returns the login response.
    /// Returns null if credentials are invalid.
    /// </summary>
    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        // 1. Find user by username
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user is null) return null;

        // 2. Validate password (plain text for Phase 1 mock)
        //    In production: BCrypt.Verify(request.Password, user.PasswordHash)
        if (user.PasswordHash != request.Password) return null;

        // 3. Generate JWT token
        var token = GenerateToken(user.UserId, user.Username, user.Role, user.EmployeeId);

        // 4. Return response
        return new LoginResponse(token, user.UserId, user.Username, user.Role, user.EmployeeId);
    }

    /// <summary>
    /// Creates a new User record after checking for duplicate usernames.
    /// Returns an anonymous object with the new user's info, or null if username exists.
    /// </summary>
    public async Task<object?> RegisterAsync(RegisterRequest request)
    {
        // Check for duplicate username
        if (await _db.Users.AnyAsync(u => u.Username == request.Username))
            return null;

        var user = new User
        {
            Username = request.Username,
            PasswordHash = request.Password, // Plain text for Phase 1
            Role = request.Role,
            EmployeeId = request.EmployeeId
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return new { user.UserId, user.Username, user.Role };
    }

    /// <summary>
    /// Generates a signed JWT token containing user claims:
    /// - userId, username, role (used by [Authorize(Roles = "HR")])
    /// - employeeId (optional, only for Employee role)
    /// Token expires in 24 hours.
    /// </summary>
    public string GenerateToken(int userId, string username, string role, int? employeeId)
    {
        var secret = _config["Jwt:Secret"] ?? "EmsApiSuperSecretKeyThatIsLongEnough123!";

        // Build claims list
        var claims = new List<Claim>
        {
            new("userId", userId.ToString()),
            new("username", username),
            new(ClaimTypes.Role, role), // Used by [Authorize(Roles = "HR")]
        };

        if (employeeId.HasValue)
            claims.Add(new Claim("employeeId", employeeId.Value.ToString()));

        // Sign with HMAC-SHA256
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "EmsApi",
            audience: "EmsApp",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
