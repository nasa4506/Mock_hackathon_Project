import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../models';

@Injectable({
      providedIn: 'root'
})
export class EmployeeService {
      private apiUrl = 'http://localhost:5255/api/employees';

      // Signal holds the list — components bind to this reactively
      employees = signal<Employee[]>([]);

      constructor(private http: HttpClient) { }

      /**
       * Fetches all employees from the backend.
       * Called by EmployeeListComponent.ngOnInit() and ProfileComponent.
       */
      loadEmployees() {
            this.http.get<Employee[]>(this.apiUrl).subscribe({
                  next: (data) => this.employees.set(data),
                  error: (err) => console.error('Failed to load employees:', err)
            });
      }

      /**
       * Fetches a single employee by ID.
       * Used by ProfileComponent to load the logged-in employee's profile.
       */
      getEmployee(id: number) {
            return this.http.get<Employee>(`${this.apiUrl}/${id}`);
      }

      /**
       * Creates a new employee via POST and refreshes the list.
       */
      addEmployee(emp: Omit<Employee, 'employeeId'>) {
            this.http.post<Employee>(this.apiUrl, emp).subscribe({
                  next: () => this.loadEmployees(), // Refresh from backend
                  error: (err) => console.error('Failed to add employee:', err)
            });
      }

      /**
       * Deletes an employee via DELETE and refreshes the list.
       */
      deleteEmployee(id: number) {
            this.http.delete(`${this.apiUrl}/${id}`).subscribe({
                  next: () => this.loadEmployees(), // Refresh from backend
                  error: (err) => console.error('Failed to delete employee:', err)
            });
      }
}
