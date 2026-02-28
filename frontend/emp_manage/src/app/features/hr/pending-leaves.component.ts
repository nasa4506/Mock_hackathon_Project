import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../core/services/leave.service';

@Component({
  selector: 'app-pending-leaves',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './hr-shared.css', // trigger rebuild
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Pending Leave Requests</h4>
      </div>
      <div class="list-group">
        <div class="list-item" *ngFor="let req of leaveService.leaves()">
          <div class="item-details">
            <span class="item-title">{{ req.employeeName }}</span>
            <span class="item-subtitle">{{ req.startDate }} to {{ req.endDate }}</span>
            <span class="item-desc">Reason: {{ req.reason }}</span>
          </div>
          <div class="item-actions">
            <span class="badge badge-warning" *ngIf="req.status === 'Pending'">Pending</span>
            <span class="badge badge-success" *ngIf="req.status === 'Approved'">Approved</span>
            <span class="badge badge-danger" *ngIf="req.status === 'Rejected'">Rejected</span>
            
            <div class="action-buttons" *ngIf="req.status === 'Pending'">
              <button class="btn btn-outline btn-sm" (click)="update(req.leaveRequestId, 'Approved')">Approve</button>
              <button class="btn btn-danger btn-sm" (click)="update(req.leaveRequestId, 'Rejected')">Reject</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PendingLeavesComponent {
  leaveService = inject(LeaveService);

  update(id: number, status: 'Approved' | 'Rejected') {
    this.leaveService.updateLeaveStatus(id, status);
  }
}
