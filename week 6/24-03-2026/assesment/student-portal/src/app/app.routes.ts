import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';
import { Courses } from './courses/courses';
import { CourseDetail } from './course-detail/course-detail';
import { Profile } from './profile/profile';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'courses', component: Courses },
  { path: 'course/:id', component: CourseDetail },
  { path: 'profile', component: Profile },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];