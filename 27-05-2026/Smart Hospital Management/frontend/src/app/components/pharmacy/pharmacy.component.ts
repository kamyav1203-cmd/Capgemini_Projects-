import { Component, OnInit } from '@angular/core';
import { PharmacyService } from '../../core/services/pharmacy.service';
import { Medicine } from '../../core/models/medicine.model';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.scss']
})
export class PharmacyComponent implements OnInit {
  manufacturers = ['Pfizer', 'Novartis', 'AstraZeneca', 'Johnson & Johnson', 'Merck'];

  medicines: Medicine[] = [];
  model: Medicine = {
    name: '',
    manufacturer: 'Pfizer',
    price: 0,
    stockQuantity: 0,
    expiryDate: ''
  };
  updateQuantity = 0;
  selectedMedicineId = 0;
  message = '';

  constructor(private pharmacyService: PharmacyService) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.pharmacyService.getMedicines().subscribe({
      next: data => this.medicines = data,
      error: err => this.message = err.error?.message || 'Unable to load medicines.'
    });
  }

  addMedicine(): void {
    this.message = '';
    this.pharmacyService.addMedicine(this.model).subscribe({
      next: () => {
        this.message = 'Medicine added successfully.';
        this.model = {
          name: '',
          manufacturer: 'Pfizer',
          price: 0,
          stockQuantity: 0,
          expiryDate: ''
        };
        this.loadMedicines();
      },
      error: err => this.message = err.error?.message || 'Unable to add medicine.'
    });
  }

  updateStock(): void {
    if (!this.selectedMedicineId || this.updateQuantity < 0) {
      this.message = 'Select a medicine and enter a valid quantity.';
      return;
    }
    this.message = '';
    this.pharmacyService.updateStock(this.selectedMedicineId, this.updateQuantity).subscribe({
      next: () => {
        this.message = 'Stock updated successfully.';
        this.selectedMedicineId = 0;
        this.updateQuantity = 0;
        this.loadMedicines();
      },
      error: err => this.message = err.error?.message || 'Unable to update stock.'
    });
  }
}
