import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({
      selector: 'app-login',
      standalone: true,
      imports: [CommonModule, ReactiveFormsModule],
      templateUrl: './login.component.html',
      styleUrl: './login.component.css'
})
export class LoginComponent {
      private fb = inject(FormBuilder);
      private authService = inject(AuthService);

      selectedRole: 'Employee' | 'HR' = 'Employee';

      loginForm = this.fb.nonNullable.group({
            username: ['emp_john', Validators.required],
            password: ['123', Validators.required]
      });

      setRole(role: 'Employee' | 'HR') {
            this.selectedRole = role;
            // Auto-fill mock credentials based on role selection for demonstration
            if (role === 'HR') {
                  this.loginForm.patchValue({ username: 'admin_hr' });
            } else {
                  this.loginForm.patchValue({ username: 'emp_john' });
            }
      }

      errorMessage = '';

      onSubmit() {
            if (this.loginForm.valid) {
                  const { username, password } = this.loginForm.value;
                  const success = this.authService.login(username!, password!, this.selectedRole);
                  if (!success) {
                        this.errorMessage = 'Invalid username or password for the selected role.';
                  } else {
                        this.errorMessage = '';
                  }
            } else {
                  this.errorMessage = 'Please fill out all fields.';
            }
      }
}
