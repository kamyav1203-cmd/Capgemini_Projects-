import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleBasedDirective } from './role-based.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RoleBasedDirective], // order doesn’t matter but keep both
  template: `
    <div class="container">

      <h1>🔐 Role-Based Dashboard</h1>

      <!-- Role Selector -->
      <div class="selector">
        <label>Select Role:</label>
        <select [(ngModel)]="role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <!-- Admin -->
      <div class="card admin" *appRoleBased="role === 'admin'">
        <h2>👑 Admin Panel</h2>
        <p>Only visible to Admin</p>
      </div>

      <!-- User -->
      <div class="card user" *appRoleBased="role === 'user'">
        <h2>🙋 User Panel</h2>
        <p>Only visible to User</p>
      </div>

    </div>
  `
})
export class AppComponent {
  role: string = 'user';
}