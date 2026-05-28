import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../core/services/patient.service';
import { Patient } from '../../core/models/patient.model';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  genders = ['Male', 'Female', 'Other'];
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  patients: Patient[] = [];
  model: Patient = {
    userId: '',
    age: 0,
    gender: 'Male',
    bloodGroup: 'A+',
    emergencyContact: '',
    medicalHistory: ''
  };
  message = '';

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: data => this.patients = data,
      error: err => this.message = err.error?.message || 'Unable to load patients.'
    });
  }

  createPatient(): void {
    this.message = '';
    this.patientService.createPatient(this.model).subscribe({
      next: () => {
        this.message = 'Patient created successfully.';
        this.model = {
          userId: '',
          age: 0,
          gender: 'Male',
          bloodGroup: 'A+',
          emergencyContact: '',
          medicalHistory: ''
        };
        this.loadPatients();
      },
      error: err => this.message = err.error?.message || 'Unable to create patient.'
    });
  }
}
