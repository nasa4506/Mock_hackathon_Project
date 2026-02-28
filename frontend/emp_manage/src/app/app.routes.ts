import { Routes } from '@angular/router';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
            path: 'login',
            loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
      },
      {
            path: 'hr',
            canActivate: [roleGuard],
            data: { role: 'HR' },
            loadChildren: () => import('./features/hr/hr.routes').then(m => m.HR_ROUTES)
      },
      {
            path: 'employee',
            canActivate: [roleGuard],
            data: { role: 'Employee' },
            loadChildren: () => import('./features/employee/employee.routes').then(m => m.EMPLOYEE_ROUTES)
      },
      { path: '**', redirectTo: 'login' }
];
