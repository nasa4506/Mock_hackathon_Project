# Frontend Architecture & Structure

## Overview
This document defines the structural plan for the Employee Management System frontend. The application will be built using the latest version of Angular, strictly following these principles:
- **Standalone Components** (No `NgModules`).
- **Reactive State** using Angular **Signals**.
- **Typed Forms** for robust validation.
- **Phase Approach**: 
  - *Phase 1:* Simple HTML structures for functional validation.
  - *Phase 2:* Implement aesthetics, typography, and unique "human-centric" CSS styling.
  - *Phase 3:* Backend integration via `HttpClient`.

---

## 1. Directory Structure (Feature-Based)

```text
src/app/
│
├── core/                  # Singleton services, interceptors, guards
│   ├── auth/              # AuthService, AuthGuard, RoleGuard
│   └── interceptors/      # JwtInterceptor, ErrorInterceptor
│
├── shared/                # Reusable UI components, pipes, directives
│   ├── components/        # Navbar, Sidebar, Modal, ConfirmDialog
│   └── ui/                # Buttons, Input Fields, Badges
│
├── features/              # Feature modules (Lazy-loaded route groups)
│   ├── auth/              # Login Component
│   ├── hr/                # HR-specific views
│   │   ├── dashboard/ 
│   │   ├── employees/     # Employee Grid, Add/Edit forms
│   │   ├── leaves/        # Accept/Reject pending leaves
│   │   └── attendance/    # Upload attendance form
│   │
│   └── employee/          # Employee-specific views
│       ├── dashboard/
│       ├── profile/       # View personal details
│       ├── leaves/        # Submit new requests, view leave history
│       └── attendance/    # Track attendance records
│
├── app.component.ts       # Root Component
└── app.routes.ts          # Root routing configuration
```

---

## 2. Components 

### Shared Layout
- `AppComponent`: Main application shell with a `<router-outlet>`.
- `NavbarComponent`: Top navigation bar containing the user context and logout button.
- `SidebarComponent`: Dynamic sidebar rendering links based on logged-in role (`HR` vs `Employee`).

### Auth Feature
- `LoginComponent`: Contains a simple HTML form with username/password. Authenticates the user and routes them according to their role.

### HR Feature
- `HrDashboardComponent`: High-level widgets and overview.
- `EmployeeListComponent`: Table view displaying all employees (CRUD).
- `EmployeeFormComponent`: Modal or separate page for adding/updating employee records.
- `PendingLeavesComponent`: View employee leave requests with actions (Approve / Reject + reason).
- `AttendanceUploadComponent`: Form to upload attendance logs (bulk or individual).

### Employee Feature
- `EmployeeDashboardComponent`: High-level widget overview.
- `ProfileViewComponent`: Read-only HTML display of the employee's personal and job details.
- `LeaveRequestComponent`: Form to submit new leaves and a table showing historical leave status.
- `AttendanceTrackerComponent`: Calendar or list view of the employee's check-ins and check-outs.

---

## 3. Routing Configuration (`app.routes.ts`)

With standalone components, we route directly to features instead of modules.

```typescript
import { Routes } from '@angular/router';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login.component').then(c => c.LoginComponent) 
  },
  {
    path: 'hr',
    canActivate: [roleGuard],
    data: { role: 'HR' },
    loadChildren: () => import('./features/hr/hr.routes').then(r => r.HR_ROUTES)
  },
  {
    path: 'employee',
    canActivate: [roleGuard],
    data: { role: 'Employee' },
    loadChildren: () => import('./features/employee/employee.routes').then(r => r.EMPLOYEE_ROUTES)
  },
  { path: '**', redirectTo: 'login' }
];
```

---

## 4. Services (Mocked for Phase 1)

During Phase 1 (Plain HTML), services will utilize **Signals** to manage local state without connecting to the `.NET` backend yet.

- `AuthService`: 
  - Manages `currentUser` signal.
  - Exposes `login(credentials)` to set a mock JWT / Role.
  - Exposes `logout()`.
- `EmployeeService`: 
  - Manages an array of employees (`Signal<Employee[]>`).
  - Contains `add()`, `update()`, `delete()`, `getAll()`.
- `LeaveService`: 
  - Manages leave requests (`Signal<LeaveRequest[]>`).
  - HR gets `approveLeave()` and `rejectLeave()`.
  - Employee gets `submitLeave()`.
- `AttendanceService`:
  - Contains `uploadAttendance()` (HR).
  - Contains `getEmployeeAttendance(empId)` (Employee).

---

## 5. Modules
In modern Angular, `NgModules` are entirely eliminated. 
- Features are provided dynamically via `providers` in routing (e.g., `provideHttpClient()`).
- Components import only what they need in the `@Component({ standalone: true, imports: [...] })` metadata block.
- We will be leveraging built-in `forms` via `ReactiveFormsModule`.
