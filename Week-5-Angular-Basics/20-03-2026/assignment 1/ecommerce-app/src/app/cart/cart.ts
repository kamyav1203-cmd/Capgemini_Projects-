import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {

  cartItems = [
    { name: 'Laptop', price: 50000, quantity: 1 },
    { name: 'Shoes', price: 2000, quantity: 2 }
  ];

  getTotal() {
    return this.cartItems.reduce((total, item) =>
      total + item.price * item.quantity, 0);
  }

  increase(item: any) {
    item.quantity++;
  }

  decrease(item: any) {
    if (item.quantity > 1) item.quantity--;
  }

  remove(item: any) {
    this.cartItems = this.cartItems.filter(i => i !== item);
  }

  clearCart() {
    this.cartItems = [];
  }
}