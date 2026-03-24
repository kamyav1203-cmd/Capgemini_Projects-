import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart.service';  // ✅ FIXED PATH

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {

  constructor(public cartService: CartService) {}

  getTotal(): number {
    return this.cartService.getTotal();
  }

}