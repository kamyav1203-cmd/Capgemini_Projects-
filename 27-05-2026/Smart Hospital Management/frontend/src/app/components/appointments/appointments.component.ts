import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../core/services/appointment.service';
import { DoctorService } from '../../core/services/doctor.service';
import { PatientService } from '../../core/services/patient.service';
import { Appointment } from '../../core/models/appointment.model';
import { Doctor } from '../../core/models/doctor.model';
import { Patient } from '../../core/models/patient.model';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  model: Appointment = {
    patientId: 0,
    doctorId: 0,
    appointmentDate: '',
    symptoms: ''
  };
  message = '';

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadDoctors();
    this.loadPatients();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: data => this.appointments = data,
      error: err => this.message = err.error?.message || 'Unable to load appointments.'
    });
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: data => this.doctors = data,
      error: err => this.message = err.error?.message || 'Unable to load doctors.'
    });
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: data => this.patients = data,
      error: err => this.message = err.error?.message || 'Unable to load patients.'
    });
  }

  bookAppointment(): void {
    this.message = '';
    this.appointmentService.bookAppointment(this.model).subscribe({
      next: () => {
        this.message = 'Appointment booked successfully.';
        this.model = {
          patientId: 0,
          doctorId: 0,
          appointmentDate: '',
          symptoms: ''
        };
        this.loadAppointments();
      },
      error: err => this.message = err.error?.message || 'Unable to book appointment.'
    });
  }
}
