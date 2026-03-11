using EmsApi.DTOs;

namespace EmsApi.Services;

/// <summary>
/// Interface for authentication operations.
/// Follows the IService / Service convention used in ASP.NET Core.
/// Registered in DI as: builder.Services.AddScoped&lt;IAuthService, AuthService&gt;()
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Validates user credentials and returns a login response with JWT token.
    /// Returns null if credentials are invalid.
    /// </summary>
    Task<LoginResponse?> LoginAsync(LoginRequest request);

    /// <summary>
    /// Registers a new user account.
    /// Returns the created user info, or null if username is taken.
    /// </summary>
    Task<object?> RegisterAsync(RegisterRequest request);

    /// <summary>
    /// Generates a JWT token for an authenticated user.
    /// </summary>
    string GenerateToken(int userId, string username, string role, int? employeeId);
}
