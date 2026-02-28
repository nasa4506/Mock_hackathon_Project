import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveService } from '../../core/services/leave.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
      selector: 'app-leave-request',
      standalone: true,
      imports: [CommonModule, ReactiveFormsModule],
      styleUrl: './emp-shared.css',
      template: `
    <div class="card">
      <div class="card-header">
        <h4>Submit Leave Request</h4>
      </div>
      <div style="padding: 2rem;">
        <form [formGroup]="leaveForm" (ngSubmit)="submit()">
          <div class="form-row">
            <div class="form-group">
              <label>Start Date</label>
              <input type="date" class="form-control" formControlName="startDate">
            </div>
            <div class="form-group">
              <label>End Date</label>
              <input type="date" class="form-control" formControlName="endDate">
            </div>
          </div>
          <div class="form-group">
            <label>Reason</label>
            <input type="text" class="form-control" formControlName="reason" placeholder="Briefly describe the reason for your leave...">
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="leaveForm.invalid">Submit Request</button>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h4>My Leaves</h4>
      </div>
      <div class="list-group">
        <div class="list-item" *ngFor="let req of myLeaves">
          <div class="item-details">
            <span class="item-title">{{ req.startDate }} to {{ req.endDate }}</span>
            <span class="item-desc">Reason: {{ req.reason }}</span>
          </div>
          <div class="item-actions">
            <span class="badge"
                  [ngClass]="{'badge-warning': req.status === 'Pending', 'badge-success': req.status === 'Approved', 'badge-danger': req.status === 'Rejected'}">
              {{ req.status }}
            </span>
          </div>
        </div>
        <div class="list-item" *ngIf="myLeaves.length === 0">
          <span class="text-muted">No leave requests found.</span>
        </div>
      </div>
    </div>
  `
})
export class LeaveRequestComponent {
      private fb = inject(FormBuilder);
      private leaveService = inject(LeaveService);
      private auth = inject(AuthService);

      get myLeaves() {
            const empId = this.auth.currentUser()?.employeeId;
            return this.leaveService.leaves().filter(l => l.employeeId === empId);
      }

      leaveForm = this.fb.group({
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            reason: ['', Validators.required]
      });

      submit() {
            if (this.leaveForm.valid) {
                  const formVal = this.leaveForm.value;
                  const user = this.auth.currentUser();
                  this.leaveService.submitLeave({
                        employeeId: user?.employeeId || 0,
                        employeeName: user?.username,
                        startDate: formVal.startDate!,
                        endDate: formVal.endDate!,
                        reason: formVal.reason!
                  });
                  this.leaveForm.reset();
            }
      }
}
