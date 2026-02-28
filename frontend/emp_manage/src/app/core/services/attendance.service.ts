import { Injectable, signal } from '@angular/core';
import { Attendance } from '../models';

@Injectable({
      providedIn: 'root'
})
export class AttendanceService {
      attendanceRecords = signal<Attendance[]>([
            { attendanceId: 1, employeeId: 101, date: '2026-02-28', status: 'Present' }
      ]);

      uploadAttendance(records: Attendance[]) {
            this.attendanceRecords.update(val => [...val, ...records]);
      }

      getEmployeeAttendance(employeeId: number) {
            return this.attendanceRecords().filter(r => r.employeeId === employeeId);
      }
}
