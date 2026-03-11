import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models';

// Response shape from POST /api/auth/login
interface LoginResponse {
      token: string;
      userId: number;
      username: string;
      role: 'HR' | 'Employee';
      employeeId: number | null;
}

@Injectable({
      providedIn: 'root'
})
export class AuthService {
      private apiUrl = 'http://localhost:5255/api/auth';

      // Reactive user state — components read this to show user info
      currentUser = signal<User | null>(null);

      constructor(private http: HttpClient, private router: Router) {
            // Restore session from localStorage on page refresh
            const stored = localStorage.getItem('user');
            if (stored) {
                  this.currentUser.set(JSON.parse(stored));
            }
      }

      /**
       * Authenticates against the backend API.
       * On success: stores JWT token + user info → navigates to dashboard.
       * On failure: returns false so the component can show an error.
       */
      login(username: string, password: string, role: 'HR' | 'Employee'): Promise<boolean> {
            return new Promise((resolve) => {
                  this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
                        .subscribe({
                              next: (res) => {
                                    // Store JWT token separately (read by jwt.interceptor.ts)
                                    localStorage.setItem('token', res.token);

                                    // Build user object for the frontend
                                    const user: User = {
                                          userId: res.userId,
                                          username: res.username,
                                          role: res.role,
                                          employeeId: res.employeeId ?? undefined
                                    };

                                    // Update reactive state + persist for page refresh
                                    this.currentUser.set(user);
                                    localStorage.setItem('user', JSON.stringify(user));

                                    // Navigate based on role
                                    if (user.role === 'HR') {
                                          this.router.navigate(['/hr']);
                                    } else {
                                          this.router.navigate(['/employee']);
                                    }
                                    resolve(true);
                              },
                              error: () => {
                                    resolve(false);
                              }
                        });
            });
      }

      /**
       * Clears all session data and redirects to login.
       */
      logout() {
            this.currentUser.set(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.router.navigate(['/login']);
      }
}
