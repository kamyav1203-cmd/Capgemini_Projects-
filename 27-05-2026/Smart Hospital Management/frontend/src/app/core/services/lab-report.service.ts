import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { LabReport } from '../models/lab-report.model';

@Injectable({providedIn: 'root'})
export class LabReportService {
  constructor(private api: ApiService) {}

  getReports(): Observable<LabReport[]> {
    return this.api.get<LabReport[]>('labreport');
  }

  createReport(report: LabReport): Observable<any> {
    return this.api.post('labreport', report);
  }
}
