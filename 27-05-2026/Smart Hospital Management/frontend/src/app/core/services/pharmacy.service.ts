import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Medicine } from '../models/medicine.model';

@Injectable({providedIn: 'root'})
export class PharmacyService {
  constructor(private api: ApiService) {}

  getMedicines(): Observable<Medicine[]> {
    return this.api.get<Medicine[]>('pharmacy');
  }

  addMedicine(medicine: Medicine): Observable<any> {
    return this.api.post('pharmacy', medicine);
  }

  updateStock(medicineId: number, quantity: number): Observable<any> {
    const params = new HttpParams().set('quantity', quantity.toString());
    return this.api.put(`pharmacy/update-stock/${medicineId}`, {}, params);
  }
}
