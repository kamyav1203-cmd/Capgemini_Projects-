import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model';

@Injectable({providedIn: 'root'})
export class DoctorService {
  constructor(private api: ApiService) {}

  getDoctors(): Observable<Doctor[]> {
    return this.api.get<Doctor[]>('doctor');
  }

  createDoctor(doctor: Doctor): Observable<any> {
    return this.api.post('doctor', doctor);
  }
}
