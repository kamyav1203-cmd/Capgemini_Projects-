import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterModule],
  template: `
    <nav>
      <a routerLink="/employees">Employees</a> |
      <a routerLink="/login">Login</a>
    </nav>
  `
})
export class NavbarComponent {}