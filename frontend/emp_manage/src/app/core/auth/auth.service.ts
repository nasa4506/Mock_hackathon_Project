import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models';

@Injectable({
      providedIn: 'root'
})
export class AuthService {
      // Using signals for reactive state
      currentUser = signal<User | null>(null);

      constructor(private router: Router) {
            // Check local storage for mock session on load
            const stored = localStorage.getItem('mockUser');
            if (stored) {
                  this.currentUser.set(JSON.parse(stored));
            }
      }

      login(username: string, password: string, role: 'HR' | 'Employee'): boolean {
            // Mock login simulating token decode and validation
            if (role === 'HR' && username === 'admin_hr' && password === '123') {
                  // Valid HR
            } else if (role === 'Employee' && username === 'emp_john' && password === '123') {
                  // Valid Employee
            } else {
                  return false;
            }

            const mockUser: User = {
                  userId: role === 'HR' ? 1 : 2,
                  username: username,
                  role: role,
                  employeeId: role === 'Employee' ? 101 : undefined
            };

            this.currentUser.set(mockUser);
            localStorage.setItem('mockUser', JSON.stringify(mockUser));

            // Route based on role
            if (role === 'HR') {
                  this.router.navigate(['/hr']);
            } else {
                  this.router.navigate(['/employee']);
            }
            return true;
      }

      logout() {
            this.currentUser.set(null);
            localStorage.removeItem('mockUser');
            this.router.navigate(['/login']);
      }
}
