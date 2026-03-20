import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent {

  user: any = {
    name: '',
    email: '',
    phone: '',
    gender: '',
    delivery: '',
    city: '',
    date: '',
    instructions: '',
    payment: ''
  };
}