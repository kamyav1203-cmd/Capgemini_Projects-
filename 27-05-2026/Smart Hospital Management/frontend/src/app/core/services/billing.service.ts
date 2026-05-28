import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill.model';

@Injectable({providedIn: 'root'})
export class BillingService {
  constructor(private api: ApiService) {}

  getBills(): Observable<Bill[]> {
    return this.api.get<Bill[]>('billing');
  }

  createBill(bill: Bill): Observable<any> {
    return this.api.post('billing', bill);
  }
}
