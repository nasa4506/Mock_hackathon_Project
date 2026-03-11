import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../core/services/attendance.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-attendance-tracker',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './emp-shared.css',
  template: `
    <div class="card">
      <div class="card-header">
        <h4>My Attendance</h4>
      </div>
      <div class="list-group">
        <div class="list-item" *ngFor="let rec of attendanceService.attendanceRecords()">
          <div class="item-details">
            <span class="item-title">Date: {{ rec.date }}</span>
          </div>
          <div class="item-actions">
            <span class="badge" 
                  [ngClass]="{'badge-success': rec.status === 'Present', 'badge-danger': rec.status === 'Absent', 'badge-warning': rec.status === 'Leave'}">
              {{ rec.status }}
            </span>
          </div>
        </div>
        <div class="list-item" *ngIf="attendanceService.attendanceRecords().length === 0">
          <span class="text-muted">No attendance records found.</span>
        </div>
      </div>
    </div>
  `
})
export class AttendanceTrackerComponent implements OnInit {
  attendanceService = inject(AttendanceService);
  private auth = inject(AuthService);

  // Load attendance records from the backend on init
  ngOnInit() {
    const empId = this.auth.currentUser()?.employeeId;
    if (empId) {
      this.attendanceService.loadAttendance(empId);
    }
  }
}
