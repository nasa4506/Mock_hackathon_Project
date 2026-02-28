import { Injectable, signal } from '@angular/core';
import { Employee } from '../models';

@Injectable({
      providedIn: 'root'
})
export class EmployeeService {
      // Mock initial data
      employees = signal<Employee[]>([
            { employeeId: 101, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '1234567890', designation: 'Developer', department: 'IT', status: 'Active' },
            { employeeId: 102, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '0987654321', designation: 'Manager', department: 'HR', status: 'Active' }
      ]);

      addEmployee(emp: Omit<Employee, 'employeeId'>) {
            const list = this.employees();
            const newId = list.length > 0 ? Math.max(...list.map(e => e.employeeId)) + 1 : 100;
            this.employees.update(val => [...val, { ...emp, employeeId: newId }]);
      }

      deleteEmployee(id: number) {
            this.employees.update(val => val.filter(e => e.employeeId !== id));
      }
}
