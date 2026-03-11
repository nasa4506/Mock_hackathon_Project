using Microsoft.EntityFrameworkCore;
using EmsApi.Models;

namespace EmsApi.Data;

/// <summary>
/// The single EF Core DbContext for the EMS application.
/// Configures all entity relationships and constraints.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();
    public DbSet<Attendance> AttendanceRecords => Set<Attendance>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User → Employee (optional 1-to-1 link)
        modelBuilder.Entity<User>()
            .HasOne(u => u.Employee)
            .WithMany()
            .HasForeignKey(u => u.EmployeeId)
            .IsRequired(false);

        // Employee → LeaveRequests (1-to-Many)
        modelBuilder.Entity<LeaveRequest>()
            .HasOne(l => l.Employee)
            .WithMany(e => e.LeaveRequests)
            .HasForeignKey(l => l.EmployeeId);

        // Employee → Attendance (1-to-Many)
        modelBuilder.Entity<Attendance>()
            .HasOne(a => a.Employee)
            .WithMany(e => e.AttendanceRecords)
            .HasForeignKey(a => a.EmployeeId);

        // Unique constraint on Username
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        // Unique constraint on Employee Email
        modelBuilder.Entity<Employee>()
            .HasIndex(e => e.Email)
            .IsUnique();
    }
}
