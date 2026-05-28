import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/login-request.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  model: LoginRequest = { email: '', password: '' };
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.message = '';
    this.authService.login(this.model).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        this.message = err.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}
