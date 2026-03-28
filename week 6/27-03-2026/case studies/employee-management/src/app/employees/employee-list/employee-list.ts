import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ IMPORTANT
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  standalone: true,
  selector: 'app-employee-list',
  imports: [CommonModule], // ✅ REQUIRED for ngFor
  template: `
    <h2>Employee List</h2>
    <ul>
      <li *ngFor="let emp of employees">
        {{emp.name}} - {{emp.role}}
      </li>
    </ul>
  `
})
export class EmployeeListComponent {

  employees: any[] = [];

  constructor(private service: EmployeeService) {
    this.employees = this.service.getEmployees();
  }
}