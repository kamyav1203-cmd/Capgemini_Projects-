import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  // Data
  productName = 'Laptop';
  price = 50000;
  quantity = 1;
  isAvailable = true;

  imageUrl = 'https://picsum.photos/150';

  // Two-way binding fields
  customerName = '';
  address = '';

  // Method (Event Binding)
  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  toggleAvailability() {
    this.isAvailable = !this.isAvailable;
  }

  // toggleButton() {
  //   this.isDisabled = !this.isDisabled;
  // }

  getTotal() {
    return this.price * this.quantity;
  }
}