import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  courses = [
    { id: 1, name: 'Angular', duration: '2 Months' },
    { id: 2, name: 'React', duration: '2 Months' },
    { id: 3, name: 'Node.js', duration: '1.5 Months' }
  ];

  getCourses() {
    return this.courses;
  }

  getCourseById(id: number) {
    return this.courses.find(c => c.id == id);
  }
}