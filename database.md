# Database Schema & Application Workflow

This document outlines the database architecture, data models, and the core workflows of the EMS (Employee Management System) Portal. Currently, the application uses **in-memory mock data** managed by Angular Signals, meaning data is reset when the application reloads (with the exception of the authentication token stored in `localStorage`).

---

## 🏗️ 1. Database Data Models

The data layer is defined by four core TypeScript interfaces in `src/app/core/models.ts`. 

### `User` (Authentication)
Handles application access and role-based routing.
- **`userId`**: `number` - Unique identifier for the login credential.
- **`username`**: `string` - The login username (e.g., `admin_hr`, `emp_john`).
- **`role`**: `'HR' | 'Employee'` - Defines access level and the dashboard the user is routed to.
- **`employeeId`**: `number` (Optional) - Links the user account to a specific employee profile.

### `Employee` (HR Management)
Represents the core employee profile data.
- **`employeeId`**: `number` - Unique identifier.
- **`firstName`**: `string`, **`lastName`**: `string` - Name details.
- **`email`**: `string`, **`phone`**: `string` - Contact details.
- **`department`**: `string` (e.g., IT, HR), **`designation`**: `string` (e.g., Developer).
- **`status`**: `'Active' | 'Inactive' | 'Revoked'` - Current employment status.

### `LeaveRequest` (Time Off Management)
Tracks leave applications from creation to approval/rejection.
- **`leaveRequestId`**: `number` - Unique request identifier.
- **`employeeId`**: `number` - The employee who made the request.
- **`employeeName`**: `string` (Optional) - Display name for quick HR viewing.
- **`startDate`**: `string`, **`endDate`**: `string` - ISO date format strings.
- **`reason`**: `string` - Justification for the leave.
- **`status`**: `'Pending' | 'Approved' | 'Rejected'` - The current state of the request.

### `Attendance` (Daily Tracking)
Records daily presence for employees.
- **`attendanceId`**: `number` - Unique record identifier.
- **`employeeId`**: `number` - The targeted employee.
- **`date`**: `string` - ISO date format string.
- **`status`**: `'Present' | 'Absent' | 'Leave'` - Attendance state for that day.

---

## 🔄 2. Application Workflows

The workflow is divided into three main pillars: **Authentication**, **HR Operations**, and **Employee Self-Service**.

### A. Authentication Workflow (`AuthService`)
1. **Login**: The user enters credentials on the `LoginComponent`. 
   - *HR Mock*: `admin_hr` / `123`
   - *Employee Mock*: `emp_john` / `123`
2. **Session Creation**: If validated, the `AuthService` generates a mock `User` object, saves it to `localStorage` (to persist across minor refreshes), and updates the `currentUser` signal.
3. **Routing**: Based on the `User.role`, the router directs the user to either `/hr` or `/employee`.

### B. HR Administrator Workflow
The HR Dashboard provides global visibility and management over the organization.
1. **Employee Management**: 
   - HR can view a list of all employees (`EmployeeListComponent`).
   - HR can add new mock employees or delete existing ones (Updates the `EmployeeService` signal array).
2. **Leave Management**:
   - HR views all globally submitted leave requests (`PendingLeavesComponent`).
   - HR can click **Approve** or **Reject** on `Pending` requests. This triggers `LeaveService.updateLeaveStatus()`.
3. **Attendance Upload**:
   - HR can upload/create mock attendance data for employees (`AttendanceUploadComponent`), distributing records to the `AttendanceService`.

### C. Employee Workflow
The Employee Dashboard provides self-service tools scoped only to the logged-in user.
1. **Profile Viewing**: 
   - The employee views their own details mapped via their `employeeId` (`ProfileComponent`).
2. **Leave Requests**:
   - The employee fills out a form specifying dates and reasons (`LeaveRequestComponent`).
   - On submit, a generic `LeaveRequest` object is created with a default status of `Pending` and injected into the global `LeaveService`.
   - The employee can immediately see their request in their "My Leaves" list, waiting for HR action.
3. **Attendance Tracking**:
   - The employee can view a read-only list of their attendance records, filtered by their `employeeId` (`AttendanceTrackerComponent`).

---

## 🔮 3. Future Database Migration Guide

Currently, the app relies on Angular `signal()` arrays in services. When transitioning to a real backend (e.g., Supabase, PostgreSQL, MongoDB):

1. **Replace Signals with HTTP Calls**: The services (`EmployeeService`, `LeaveService`, `AttendanceService`) will inject Angular's `HttpClient`. Instead of `.update()` on signals, they will make `POST`, `GET`, `PUT`, and `DELETE` requests to a REST API.
2. **Relational Setup**:
   - `Users` table (1-to-1 with `Employees` table).
   - `Employees` table (1-to-Many with `LeaveRequests` and `Attendance` tables).
3. **Authentication**: Replace local storage token mocks with proper JWT handling and route guards (`CanActivate`).
