import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { EmployeeListComponent } from './employees/employee-list/employee-list';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'employees',
    component: EmployeeListComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' } // safety fallback
];