import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeaveRequest } from '../models';

@Injectable({
      providedIn: 'root'
})
export class LeaveService {
      private apiUrl = 'http://localhost:5255/api/leaves';

      // Signal holds the leave list — components bind to this reactively
      leaves = signal<LeaveRequest[]>([]);

      constructor(private http: HttpClient) { }

      /**
       * Loads ALL leave requests (HR view).
       * Called by PendingLeavesComponent.ngOnInit().
       */
      loadAllLeaves() {
            this.http.get<LeaveRequest[]>(this.apiUrl).subscribe({
                  next: (data) => this.leaves.set(data),
                  error: (err) => console.error('Failed to load leaves:', err)
            });
      }

      /**
       * Loads leaves for a specific employee (Employee view).
       * Called by LeaveRequestComponent.ngOnInit().
       */
      loadMyLeaves(empId: number) {
            this.http.get<LeaveRequest[]>(`${this.apiUrl}/employee/${empId}`).subscribe({
                  next: (data) => this.leaves.set(data),
                  error: (err) => console.error('Failed to load my leaves:', err)
            });
      }

      /**
       * Submits a new leave request via POST.
       * After success, reloads the employee's leaves to show the new entry.
       */
      submitLeave(req: { employeeId: number; startDate: string; endDate: string; reason: string }) {
            this.http.post(this.apiUrl, req).subscribe({
                  next: () => this.loadMyLeaves(req.employeeId), // Refresh list
                  error: (err) => console.error('Failed to submit leave:', err)
            });
      }

      /**
       * HR approves or rejects a leave request via PUT.
       * After success, reloads the full list.
       */
      updateLeaveStatus(leaveRequestId: number, status: 'Approved' | 'Rejected') {
            this.http.put(`${this.apiUrl}/${leaveRequestId}/status`, { status }).subscribe({
                  next: () => this.loadAllLeaves(), // Refresh HR view
                  error: (err) => console.error('Failed to update leave status:', err)
            });
      }
}
