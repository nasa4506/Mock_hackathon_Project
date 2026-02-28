# Employee Management System

## Overview
An Employee Management System designed for efficiency and aesthetics. HR can securely add, update, or delete employee details, while employees have dedicated access to view their profiles, submit leave requests, and track their attendance. 

## Technologies
- **Frontend**: TypeScript, Angular (Latest) with Standalone Components & Signals
- **Backend**: C#, ASP.NET Core (Latest LTS), Minimal APIs / Vertical Slice architecture pattern
- **Database**: MySQL / SQL Server (SSMS) integrated via Entity Framework Core (EF Core)
- **Authentication**: Secure JWT (JSON Web Tokens)

## Core Features
1. **Authentication & Authorization**: Strict JWT-based security granting differing access levels to Admin, HR, and Employees.
2. **Employee Records (CRUD)**: Robust tracking of employee demographics, joining dates, and designations.
3. **Leave Request Workflow**: Employees can apply for leaves which go to HR for approval or rejection (with optional detailed reasoning).
4. **Attendance Tracker**: HR can upload attendance statuses, which employees can seamlessly monitor.
5. **Modern, Aesthetic Interface**: A unique, "human-centric" design that focuses on usability, speed, and crash resistance in production.

---

## API Endpoints Definition

### Authentication
- `POST /api/auth/login` - Authenticate a user and issue a JWT token.
- `POST /api/auth/register` - Register new user credentials.

### Employees
- `GET /api/employees` - Retrieve all employees (HR).
- `GET /api/employees/{id}` - Retrieve details of a specific employee.
- `POST /api/employees` - Register a newly onboarded employee (HR).
- `PUT /api/employees/{id}` - Update existing employee details (HR).
- `DELETE /api/employees/{id}` - Remove or deactivate an employee (HR).

### Leave Requests
- `GET /api/leaves` - Get all pending/active leave requests (HR).
- `GET /api/leaves/employee/{empId}` - Track leave requests specific to an employee.
- `POST /api/leaves` - Apply for leave (Employee).
- `PUT /api/leaves/{id}/status` - Approve or reject an active leave request (HR).

### Attendance
- `GET /api/attendance/employee/{empId}` - Track monthly attendance overview (Employee).
- `POST /api/attendance/upload` - System for HR to upload bulk attendance data.

---

## Frontend Structure Breakdown

The frontend adopts a standalone component architecture with Angular Signals and typed forms ensuring no complex/bloated RxJS pipelines, ensuring robust stability.

### Layouts & Dashboards
1. **Auth Shell**
   - Distinct, aesthetically pleasing login flows separating HR capabilities and standard Employee access. 
2. **HR Dashboard**
   - **`/hr/employees`**: Comprehensive data grid for employee CRUD operations. Focuses on speed and readability.
   - **`/hr/attendance`**: Dedicated portal segment for batch uploading attendance logs.
   - **`/hr/leaves`**: A pending-action queue where HR reviews employee leave workflows (Accept/Reject with optional reasons).
3. **Employee Dashboard**
   - **`/employee/profile`**: Read-only attractive view of personal demographic and professional data.
   - **`/employee/attendance`**: Visual tracker (e.g., calendar or strict list) of past and current attendance statusees.
   - **`/employee/leaves`**: Real-time form for submitting absence requests along with a historical tracking section.

---

## Backend

> *(Section intentionally left empty as per requirements)*

---

## Database Structure

### 1. Users Table (For Login, Roles, Authentication)
| Column | Type | Notes |
| :--- | :--- | :--- |
| UserId (PK) | int | Identity |
| Username | varchar(50) | Unique |
| PasswordHash | varchar(255) | Hashed password |
| Role | varchar(20) | HR or Employee |
| EmployeeId (FK, nullable) | int | Linked when user is an employee |

*🔗 FK: EmployeeId → Employees.EmployeeId*

### 2. Employees Table (HR manages these records)
| Column | Type | Notes |
| :--- | :--- | :--- |
| EmployeeId (PK) | int | Identity |
| FirstName | varchar(50) | |
| LastName | varchar(50) | |
| Email | varchar(100) | Unique |
| Phone | varchar(15) | |
| DOB | date | |
| Designation | varchar(50) | |
| Department | varchar(50) | |
| DateOfJoining | date | |
| Status | varchar(20) | Active, Inactive, Revoked |
| CreatedBy (FK) | int | HR UserId |
| CreatedAt | datetime | |
| UpdatedBy (FK) | int | HR UserId |
| UpdatedAt | datetime | |

*🔗 FK: CreatedBy, UpdatedBy → Users.UserId*

### 3. Attendance Table (Employees can view; HR manages)
| Column | Type | Notes |
| :--- | :--- | :--- |
| AttendanceId (PK) | int | Identity |
| EmployeeId (FK) | int | Required |
| Date | date | One record/day |
| CheckInTime | datetime | nullable |
| CheckOutTime | datetime | nullable |
| Status | varchar(20) | Present, Absent, Leave |

*🔗 FK: EmployeeId → Employees.EmployeeId*

### 4. LeaveRequests Table (Employee applies, HR approves/rejects)
| Column | Type | Notes |
| :--- | :--- | :--- |
| LeaveRequestId (PK) | int | Identity |
| EmployeeId (FK) | int | |
| StartDate | date | |
| EndDate | date | |
| Reason | varchar(255) | |
| Status | varchar(20) | Pending, Approved, Rejected |
| AppliedOn | datetime | |
| ReviewedBy (FK, nullable) | int | HR UserId |
| ReviewedOn (nullable) | datetime | |

*🔗 FK: EmployeeId → Employees.EmployeeId*
*🔗 FK: ReviewedBy → Users.UserId*

### 5. Performance Table (HR manages employee performance)
| Column | Type | Notes |
| :--- | :--- | :--- |
| PerformanceId (PK) | int | Identity |
| EmployeeId (FK) | int | |
| ReviewDate | date | |
| Rating | int | 1–5 |
| Comments | varchar(255) | |
| Status | varchar(20) | Active, Inactive, Revoked |
| ReviewedBy (FK) | int | HR UserId |

*🔗 FK: EmployeeId → Employees.EmployeeId*
*🔗 FK: ReviewedBy → Users.UserId*
