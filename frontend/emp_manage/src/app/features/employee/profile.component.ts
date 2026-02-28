import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './emp-shared.css',
  template: `
    <div class="card" *ngIf="profile">
      <div class="card-header">
        <h4>My Profile</h4>
      </div>
      <div class="profile-details">
        <div class="detail-item">
          <span class="detail-label">Name</span>
          <span class="detail-value">{{ profile.firstName }} {{ profile.lastName }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email</span>
          <span class="detail-value">{{ profile.email }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Department</span>
          <span class="detail-value"><span class="badge">{{ profile.department }}</span></span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Designation</span>
          <span class="detail-value">{{ profile.designation }}</span>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  private auth = inject(AuthService);
  private empService = inject(EmployeeService);

  profile = this.empService.employees().find(e => e.employeeId === this.auth.currentUser()?.employeeId);
}
