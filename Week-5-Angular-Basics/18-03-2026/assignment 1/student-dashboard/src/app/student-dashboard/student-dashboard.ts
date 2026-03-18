import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css']
})
export class StudentDashboard {

  students = [
    { name: 'Amit', marks: 85 },
    { name: 'Neha', marks: 45 },
    { name: 'Rahul', marks: 72 },
    { name: 'Priya', marks: 30 },
    { name: 'Karan', marks: 95 }
  ];

  getGrade(marks: number) {
    if (marks >= 90) return 'A';
    else if (marks >= 70) return 'B';
    else if (marks >= 50) return 'C';
    else return 'F';
  }
}