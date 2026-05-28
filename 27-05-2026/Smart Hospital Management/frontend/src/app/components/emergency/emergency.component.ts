import { Component, OnInit } from '@angular/core';
import { EmergencyService } from '../../core/services/emergency.service';
import { EmergencyRequest } from '../../core/models/emergency-request.model';
import { PatientService } from '../../core/services/patient.service';
import { Patient } from '../../core/models/patient.model';

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.component.html',
  styleUrls: ['./emergency.component.scss']
})
export class EmergencyComponent implements OnInit {
  emergencies: EmergencyRequest[] = [];
  patients: Patient[] = [];
  model: EmergencyRequest = {
    patientId: 0,
    description: '',
    location: ''
  };
  message = '';

  constructor(
    private emergencyService: EmergencyService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadEmergencies();
    this.loadPatients();
  }

  loadEmergencies(): void {
    this.emergencyService.getEmergencies().subscribe({
      next: data => this.emergencies = data,
      error: err => this.message = err.error?.message || 'Unable to load emergencies.'
    });
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: data => this.patients = data,
      error: err => this.message = err.error?.message || 'Unable to load patients.'
    });
  }

  createEmergency(): void {
    this.message = '';
    this.emergencyService.createEmergency(this.model).subscribe({
      next: () => {
        this.message = 'Emergency request created successfully.';
        this.model = { patientId: 0, description: '', location: '' };
        this.loadEmergencies();
      },
      error: err => this.message = err.error?.message || 'Unable to create emergency request.'
    });
  }
}
