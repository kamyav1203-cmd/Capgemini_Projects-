import { Component } from '@angular/core';
import { StudentDashboard } from './student-dashboard/student-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StudentDashboard],
  template: `<app-student-dashboard></app-student-dashboard>`
})
export class AppComponent {}