import { Component, OnInit } from '@angular/core';
import { LabReportService } from '../../core/services/lab-report.service';
import { PatientService } from '../../core/services/patient.service';
import { LabReport } from '../../core/models/lab-report.model';
import { Patient } from '../../core/models/patient.model';

@Component({
  selector: 'app-lab-report',
  templateUrl: './lab-report.component.html',
  styleUrls: ['./lab-report.component.scss']
})
export class LabReportComponent implements OnInit {
  testNames = ['Blood Test', 'X-Ray', 'MRI', 'Ultrasound', 'ECG', 'Urine Test'];

  reports: LabReport[] = [];
  patients: Patient[] = [];
  model: LabReport = {
    patientId: 0,
    testName: 'Blood Test',
    result: '',
    filePath: ''
  };
  message = '';

  constructor(
    private reportService: LabReportService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadReports();
    this.loadPatients();
  }

  loadReports(): void {
    this.reportService.getReports().subscribe({
      next: data => this.reports = data,
      error: err => this.message = err.error?.message || 'Unable to load lab reports.'
    });
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: data => this.patients = data,
      error: err => this.message = err.error?.message || 'Unable to load patients.'
    });
  }

  createReport(): void {
    this.message = '';
    this.reportService.createReport(this.model).subscribe({
      next: () => {
        this.message = 'Lab report uploaded successfully.';
        this.model = {
          patientId: 0,
          testName: '',
          result: '',
          filePath: ''
        };
        this.loadReports();
      },
      error: err => this.message = err.error?.message || 'Unable to upload lab report.'
    });
  }
}
