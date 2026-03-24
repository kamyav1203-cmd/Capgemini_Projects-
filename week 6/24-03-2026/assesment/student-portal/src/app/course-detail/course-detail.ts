import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../course';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  templateUrl: './course-detail.html'
})
export class CourseDetail {

  course: any;

  constructor(
    private route: ActivatedRoute,
    private service: CourseService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.course = this.service.getCourseById(id);
  }
}