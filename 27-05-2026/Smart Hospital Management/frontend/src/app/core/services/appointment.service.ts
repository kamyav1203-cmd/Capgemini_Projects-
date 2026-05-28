import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({providedIn: 'root'})
export class AppointmentService {
  constructor(private api: ApiService) {}

  getAppointments(): Observable<Appointment[]> {
    return this.api.get<Appointment[]>('appointment');
  }

  bookAppointment(appointment: Appointment): Observable<Appointment> {
    return this.api.post<Appointment>('appointment/book', appointment);
  }
}
