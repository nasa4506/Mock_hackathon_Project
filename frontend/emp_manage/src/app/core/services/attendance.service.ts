import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Attendance } from '../models';

@Injectable({
      providedIn: 'root'
})
export class AttendanceService {
      private apiUrl = 'http://localhost:5255/api/attendance';

      // Signal holds the attendance records — components bind to this reactively
      attendanceRecords = signal<Attendance[]>([]);

      constructor(private http: HttpClient) { }

      /**
       * Loads attendance records for a specific employee.
       * Called by AttendanceTrackerComponent.ngOnInit() and AttendanceUploadComponent.
       */
      loadAttendance(employeeId: number) {
            this.http.get<Attendance[]>(`${this.apiUrl}/employee/${employeeId}`).subscribe({
                  next: (data) => this.attendanceRecords.set(data),
                  error: (err) => console.error('Failed to load attendance:', err)
            });
      }

      /**
       * HR uploads bulk attendance records via POST.
       * After success, reloads the list for the given employee.
       */
      uploadAttendance(records: { employeeId: number; date: string; status: string }[]) {
            this.http.post(`${this.apiUrl}/upload`, { records }).subscribe({
                  next: () => {
                        // Reload attendance for the first employee in the batch
                        if (records.length > 0) {
                              this.loadAttendance(records[0].employeeId);
                        }
                  },
                  error: (err) => console.error('Failed to upload attendance:', err)
            });
      }

      /**
       * Helper used by components — returns the current signal value filtered by employee.
       * Components can also directly read attendanceRecords() signal.
       */
      getEmployeeAttendance(employeeId: number) {
            return this.attendanceRecords().filter(r => r.employeeId === employeeId);
      }
}
