import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { EmergencyRequest } from '../models/emergency-request.model';

@Injectable({providedIn: 'root'})
export class EmergencyService {
  constructor(private api: ApiService) {}

  getEmergencies(): Observable<EmergencyRequest[]> {
    return this.api.get<EmergencyRequest[]>('emergency');
  }

  createEmergency(request: EmergencyRequest): Observable<any> {
    return this.api.post('emergency', request);
  }
}
