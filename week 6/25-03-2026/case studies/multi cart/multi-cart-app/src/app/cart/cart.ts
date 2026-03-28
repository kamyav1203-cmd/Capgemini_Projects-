import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart {

  constructor(private cartService: CartService) {}

  getItems() {
    return this.cartService.getItems();
  }

  removeItem(index: number) {
    this.cartService.removeItem(index);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  getTotal() {
    return this.cartService.getItems()
      .reduce((sum: number, item: any) => sum + item.price, 0);
  }
}