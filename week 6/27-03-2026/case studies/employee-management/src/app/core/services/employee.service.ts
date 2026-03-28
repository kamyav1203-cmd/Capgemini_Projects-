import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  employees = [
    { id: 1, name: 'John', role: 'Developer' },
    { id: 2, name: 'Jane', role: 'Manager' }
  ];

  getEmployees() {
    return this.employees;
  }

  getEmployee(id: number) {
    return this.employees.find(e => e.id === id);
  }

  addEmployee(emp: any) {
    this.employees.push(emp);
  }
  updateEmployee(updatedEmp: any) {
  const index = this.employees.findIndex(e => e.id === updatedEmp.id);
  if (index !== -1) {
    this.employees[index] = { ...updatedEmp };
  }
}

deleteEmployee(id: number) {
  this.employees = this.employees.filter(e => e.id !== id);
}

searchEmployees(term: string) {
  return this.employees.filter(e =>
    e.name.toLowerCase().includes(term.toLowerCase()) ||
    e.role.toLowerCase().includes(term.toLowerCase())
  );
}
}