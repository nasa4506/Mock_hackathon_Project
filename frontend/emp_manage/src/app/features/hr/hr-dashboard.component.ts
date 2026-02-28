import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  styleUrl: './hr-dashboard.component.css',
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="brand">EMS Admin</div>
        <nav>
          <ul>
            <li><a routerLink="/hr/employees" routerLinkActive="active">Manage Employees</a></li>
            <li><a routerLink="/hr/leaves" routerLinkActive="active">Pending Leaves</a></li>
            <li><a routerLink="/hr/attendance" routerLinkActive="active">Upload Attendance</a></li>
          </ul>
        </nav>
      </aside>
      <main class="content-area">
        <header class="topbar">
          <h2>HR Dashboard</h2>
        </header>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class HrDashboardComponent { }
