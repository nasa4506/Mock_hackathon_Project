import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  styleUrl: './emp-dashboard.component.css',
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="brand">EMS Portal</div>
        <nav>
          <ul>
            <li><a routerLink="/employee/profile" routerLinkActive="active">My Profile</a></li>
            <li><a routerLink="/employee/leaves" routerLinkActive="active">My Leaves</a></li>
            <li><a routerLink="/employee/attendance" routerLinkActive="active">My Attendance</a></li>
          </ul>
        </nav>
      </aside>
      <main class="content-area">
        <header class="topbar">
          <h2>Employee Dashboard</h2>
        </header>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class EmployeeDashboardComponent { }
