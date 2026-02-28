import { Routes } from '@angular/router';
import { EmployeeDashboardComponent } from './employee-dashboard.component';
import { ProfileComponent } from './profile.component';
import { LeaveRequestComponent } from './leave-request.component';
import { AttendanceTrackerComponent } from './attendance-tracker.component';

export const EMPLOYEE_ROUTES: Routes = [
      {
            path: '',
            component: EmployeeDashboardComponent,
            children: [
                  { path: 'profile', component: ProfileComponent },
                  { path: 'leaves', component: LeaveRequestComponent },
                  { path: 'attendance', component: AttendanceTrackerComponent },
                  { path: '', redirectTo: 'profile', pathMatch: 'full' }
            ]
      }
];
