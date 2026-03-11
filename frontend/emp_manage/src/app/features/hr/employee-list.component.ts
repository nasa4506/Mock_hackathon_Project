import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: './hr-shared.css',
  template: `
    <div class="card">
      <div class="card-header">
        <h4>Employee Directory</h4>
        <button class="btn btn-primary btn-sm" (click)="showForm.set(!showForm())">
          {{ showForm() ? '✕ Cancel' : '+ Add Employee' }}
        </button>
      </div>

      <!-- Add Employee Form (toggleable) -->
      <div *ngIf="showForm()" class="form-section">
        <form [formGroup]="empForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label>First Name</label>
              <input type="text" class="form-control" formControlName="firstName" placeholder="John">
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" class="form-control" formControlName="lastName" placeholder="Doe">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Email</label>
              <input type="email" class="form-control" formControlName="email" placeholder="john&#64;company.com">
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="text" class="form-control" formControlName="phone" placeholder="1234567890">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Designation</label>
              <input type="text" class="form-control" formControlName="designation" placeholder="Developer">
            </div>
            <div class="form-group">
              <label>Department</label>
              <select class="form-control" formControlName="department">
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="empForm.invalid">
              Add Employee
            </button>
          </div>
        </form>
      </div>

      <!-- Employee Table -->
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
export class EmployeeListComponent implements OnInit {
  private fb = inject(FormBuilder);
  employeeService = inject(EmployeeService);

  // Toggle for showing/hiding the add form
  showForm = signal(false);

  // Reactive form with validation
  empForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    designation: ['', Validators.required],
    department: ['', Validators.required]
  });

  ngOnInit() {
    this.employeeService.loadEmployees();
  }

  onSubmit() {
    if (this.empForm.valid) {
      // Send to backend: POST /api/employees → MySQL insert → refresh list
      this.employeeService.addEmployee({
        ...this.empForm.getRawValue(),
        status: 'Active'
      });
      this.empForm.reset();
      this.showForm.set(false);
    }
  }

  deleteEmp(id: number) {
    this.employeeService.deleteEmployee(id);
  }
}
