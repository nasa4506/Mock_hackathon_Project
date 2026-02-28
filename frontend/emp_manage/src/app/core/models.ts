export interface User {
      userId: number;
      username: string;
      role: 'HR' | 'Employee';
      employeeId?: number;
}

export interface Employee {
      employeeId: number;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      designation: string;
      department: string;
      status: 'Active' | 'Inactive' | 'Revoked';
}

export interface LeaveRequest {
      leaveRequestId: number;
      employeeId: number;
      employeeName?: string;
      startDate: string;
      endDate: string;
      reason: string;
      status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Attendance {
      attendanceId: number;
      employeeId: number;
      date: string;
      status: 'Present' | 'Absent' | 'Leave';
}
