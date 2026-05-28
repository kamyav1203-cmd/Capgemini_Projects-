import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Statistics } from '../models/statistics.model';

@Injectable({providedIn: 'root'})
export class DashboardService {
  constructor(private api: ApiService) {}

  getStatistics(): Observable<Statistics> {
    return this.api.get<Statistics>('dashboard/statistics');
  }
}
