import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({providedIn: 'root'})
export class PatientService {
  constructor(private api: ApiService) {}

  getPatients(): Observable<Patient[]> {
    return this.api.get<Patient[]>('patient');
  }

  createPatient(patient: Patient): Observable<any> {
    return this.api.post('patient', patient);
  }
}
