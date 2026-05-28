import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../core/services/doctor.service';
import { Doctor } from '../../core/models/doctor.model';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent implements OnInit {
  specializations = [
    'General',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology'
  ];

  doctors: Doctor[] = [];
  model: Doctor = {
    userId: '',
    specialization: 'General',
    experienceYears: 0,
    consultationFee: 0
  };
  message = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: data => this.doctors = data,
      error: err => this.message = err.error?.message || 'Unable to load doctors.'
    });
  }

  createDoctor(): void {
    this.message = '';
    this.doctorService.createDoctor(this.model).subscribe({
      next: () => {
        this.message = 'Doctor created successfully.';
        this.model = {
          userId: '',
          specialization: 'General',
          experienceYears: 0,
          consultationFee: 0
        };
        this.loadDoctors();
      },
      error: err => this.message = err.error?.message || 'Unable to create doctor.'
    });
  }
}
