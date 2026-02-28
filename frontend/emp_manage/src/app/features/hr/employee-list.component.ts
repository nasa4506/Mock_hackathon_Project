import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './hr-shared.css', // trigger rebuild
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Employee Directory</h4>
        <button class="btn btn-primary btn-sm" (click)="addMock()">+ Add Mock Employee</button>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Employee Name</th><th>Email</th><th>Department</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let emp of employeeService.employees()">
              <td>#{{ emp.employeeId }}</td>
              <td><strong>{{ emp.firstName }} {{ emp.lastName }}</strong></td>
              <td class="text-muted">{{ emp.email }}</td>
              <td><span class="badge">{{ emp.department }}</span></td>
              <td><span class="badge badge-success">{{ emp.status }}</span></td>
              <td><button class="btn btn-danger btn-sm" (click)="deleteEmp(emp.employeeId)">Delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class EmployeeListComponent {
  employeeService = inject(EmployeeService);

  addMock() {
    this.employeeService.addEmployee({
      firstName: 'New', lastName: 'User', email: 'new@test.com', phone: '123', designation: 'QA', department: 'IT', status: 'Active'
    });
  }

  deleteEmp(id: number) {
    this.employeeService.deleteEmployee(id);
  }
}
