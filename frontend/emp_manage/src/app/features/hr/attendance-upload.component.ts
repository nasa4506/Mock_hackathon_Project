import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../core/services/attendance.service';

@Component({
  selector: 'app-attendance-upload',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './hr-shared.css', // trigger rebuild
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Upload Attendance Data (Mock)</h4>
        <button class="btn btn-primary btn-sm" (click)="uploadMock()">Upload 1 Day Attendance for Employee 101</button>
      </div>
      <div class="list-group">
        <div class="list-item" *ngFor="let rec of attendanceService.attendanceRecords()">
          <div class="item-details">
            <span class="item-title">Employee ID: {{ rec.employeeId }}</span>
            <span class="item-subtitle">Date: {{ rec.date }}</span>
          </div>
          <div class="item-actions">
            <span class="badge" 
                  [ngClass]="{'badge-success': rec.status === 'Present', 'badge-danger': rec.status === 'Absent', 'badge-warning': rec.status === 'Leave'}">
              {{ rec.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AttendanceUploadComponent {
  attendanceService = inject(AttendanceService);

  uploadMock() {
    this.attendanceService.uploadAttendance([
      { attendanceId: Date.now(), employeeId: 101, date: new Date().toISOString().split('T')[0], status: 'Present' }
    ]);
  }
}
