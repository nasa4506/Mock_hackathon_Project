import { Injectable, signal } from '@angular/core';
import { LeaveRequest } from '../models';

@Injectable({
      providedIn: 'root'
})
export class LeaveService {
      leaves = signal<LeaveRequest[]>([
            { leaveRequestId: 1, employeeId: 101, employeeName: 'John Doe', startDate: '2026-03-01', endDate: '2026-03-03', reason: 'Vacation', status: 'Pending' }
      ]);

      submitLeave(req: Omit<LeaveRequest, 'leaveRequestId' | 'status'>) {
            const list = this.leaves();
            const newId = list.length > 0 ? Math.max(...list.map(l => l.leaveRequestId)) + 1 : 1;
            this.leaves.update(val => [...val, { ...req, leaveRequestId: newId, status: 'Pending' }]);
      }

      updateLeaveStatus(leaveRequestId: number, status: 'Approved' | 'Rejected') {
            this.leaves.update(list => list.map(l => l.leaveRequestId === leaveRequestId ? { ...l, status } : l));
      }
}
