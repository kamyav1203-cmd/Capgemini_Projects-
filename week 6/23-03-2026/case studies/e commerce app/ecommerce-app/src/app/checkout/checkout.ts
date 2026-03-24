import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html'
})
export class CheckoutComponent {

  form = {
    name: '',
    email: '',
    address: '',
    payment: ''
  };

  submit() {
    alert('Order Placed Successfully!');
    console.log(this.form);
  }
}