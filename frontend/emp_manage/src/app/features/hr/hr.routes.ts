import { Routes } from '@angular/router';
import { HrDashboardComponent } from './hr-dashboard.component';
import { EmployeeListComponent } from './employee-list.component';
import { PendingLeavesComponent } from './pending-leaves.component';
import { AttendanceUploadComponent } from './attendance-upload.component';

export const HR_ROUTES: Routes = [
      {
            path: '',
            component: HrDashboardComponent,
            children: [
                  { path: 'employees', component: EmployeeListComponent },
                  { path: 'leaves', component: PendingLeavesComponent },
                  { path: 'attendance', component: AttendanceUploadComponent },
                  { path: '', redirectTo: 'employees', pathMatch: 'full' }
            ]
      }
];
