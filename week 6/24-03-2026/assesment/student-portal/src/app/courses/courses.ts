import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../course';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './courses.html'
})
export class Courses {

  courses: any;

  constructor(private service: CourseService) {}

  ngOnInit() {
    this.courses = this.service.getCourses();
  }
}