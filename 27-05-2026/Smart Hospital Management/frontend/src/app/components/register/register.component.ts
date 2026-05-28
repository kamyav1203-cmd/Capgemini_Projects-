import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../core/models/register-request.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  branches = [
    { id: 1, name: 'Main Branch' },
    { id: 2, name: 'East Side Branch' },
    { id: 3, name: 'West Wing Branch' }
  ];

  model: RegisterRequest = {
    fullName: '',
    email: '',
    password: '',
    role: 'Patient',
    branchId: undefined
  };
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.message = '';

    const payload = {
      fullName: this.model.fullName,
      email: this.model.email,
      password: this.model.password,
      role: this.model.role,
      branchId:
        this.model.branchId === undefined || Number.isNaN(this.model.branchId)
          ? undefined
          : this.model.branchId
    };

    this.authService.register(payload).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        this.message = err.error?.Message || err.error?.message || 'Registration failed.';
      }
    });
  }
}
