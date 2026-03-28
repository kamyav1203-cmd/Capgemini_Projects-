import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products {

  constructor(private cartService: CartService) {}

  products = [
    { name: 'Laptop', price: 80000 },
    { name: 'Phone', price: 30000 },
    { name: 'Headphones', price: 2000 },
    { name: 'Smart Watch', price: 5000 },
    { name: 'Keyboard', price: 1500 },
    { name: 'Priyadarshni ❤️', price: 0, stock: 1 } // 👈 limited
  ];

  addToCart(product: any) {
    // check stock
    if (product.stock === 0) return;

    this.cartService.addItem(product);

    // reduce stock only for Priyadarshni
    if (product.name === 'Priyadarshni ❤️') {
      product.stock--;
    }
  }
}