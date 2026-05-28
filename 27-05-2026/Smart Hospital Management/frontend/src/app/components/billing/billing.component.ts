import { Component, OnInit } from '@angular/core';
import { BillingService } from '../../core/services/billing.service';
import { PatientService } from '../../core/services/patient.service';
import { Bill } from '../../core/models/bill.model';
import { Patient } from '../../core/models/patient.model';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  bills: Bill[] = [];
  patients: Patient[] = [];
  model: Bill = {
    patientId: 0,
    amount: 0,
    paymentMethod: 'Cash'
  };
  message = '';

  constructor(
    private billingService: BillingService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadBills();
    this.loadPatients();
  }

  loadBills(): void {
    this.billingService.getBills().subscribe({
      next: data => this.bills = data,
      error: err => this.message = err.error?.message || 'Unable to load bills.'
    });
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: data => this.patients = data,
      error: err => this.message = err.error?.message || 'Unable to load patients.'
    });
  }

  createBill(): void {
    this.message = '';
    this.billingService.createBill(this.model).subscribe({
      next: () => {
        this.message = 'Bill created successfully.';
        this.model = {
          patientId: 0,
          amount: 0,
          paymentMethod: 'Cash'
        };
        this.loadBills();
      },
      error: err => this.message = err.error?.message || 'Unable to create bill.'
    });
  }
}
