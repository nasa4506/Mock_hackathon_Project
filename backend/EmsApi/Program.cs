using System.Text;
using EmsApi.Data;
using EmsApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// ═══════════════════════════════════════════════════════════════
//  EMS API — Program.cs (Composition Root)
//
//  Standard ASP.NET Core Web API structure using Controllers.
//  This wires up:
//  1. EF Core InMemory database
//  2. JWT authentication + role-based authorization
//  3. CORS for the Angular dev server (localhost:4200)
//  4. Controller discovery and routing
//  5. Database seeding with mock data
// ═══════════════════════════════════════════════════════════════

var builder = WebApplication.CreateBuilder(args);

// ── 1. Add Controllers ─────────────────────────────────────────
// Discovers all [ApiController] classes in the Controllers/ folder
builder.Services.AddControllers();

// ── 1b. Register Services (Interface → Implementation) ─────────
builder.Services.AddScoped<IAuthService, AuthService>();

// ── 2. Database (MySQL via Oracle EF Core provider) ────────────
// Connection string is read from appsettings.json → ConnectionStrings:DefaultConnection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(connectionString));

// ── 3. JWT Authentication ──────────────────────────────────────
var jwtSecret = builder.Configuration["Jwt:Secret"]
    ?? "EmsApiSuperSecretKeyThatIsLongEnough123!";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "EmsApi",
            ValidAudience = "EmsApp",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

// ── 4. Authorization Policies ──────────────────────────────────
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("HR", policy => policy.RequireRole("HR"))
    .AddPolicy("Employee", policy => policy.RequireRole("Employee"));

// ── 5. CORS ────────────────────────────────────────────────────
// Allow the Angular dev server to talk to this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ── 6. Swagger / OpenAPI (for testing in browser) ──────────────
builder.Services.AddOpenApi();

var app = builder.Build();

// ── 7. Middleware Pipeline ─────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "EMS API v1");
    });
}

app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();

// ── 8. Map Controllers ─────────────────────────────────────────
// Routes are defined via [Route] and [Http*] attributes on controllers
app.MapControllers();

// ── 9. Seed Database ───────────────────────────────────────────
// EnsureCreated() auto-generates all MySQL tables from our EF Core models.
// This replaces the need for 'dotnet ef migrations' which has .NET 10
// compatibility issues with MySQL providers as of Feb 2026.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated(); // Creates ems_db schema + all tables
    SeedData.Initialize(db);
}

// ── 10. Run ────────────────────────────────────────────────────
app.Run();
