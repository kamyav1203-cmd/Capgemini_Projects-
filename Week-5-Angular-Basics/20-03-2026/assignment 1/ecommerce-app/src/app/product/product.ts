import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})
export class ProductComponent {

  searchText = '';
  selectedCategory = '';

  products = [
    { id: 1, name: 'Laptop', price: 50000, category: 'Electronics', rating: 4.5, image: 'https://via.placeholder.com/150', quantity: 1 },
    { id: 2, name: 'Shoes', price: 2000, category: 'Fashion', rating: 4, image: 'https://via.placeholder.com/150', quantity: 1 }
  ];

  cart: any[] = [];

  addToCart(product: any) {
    const existing = this.cart.find(p => p.id === product.id);

    if (existing) {
      existing.quantity += product.quantity;
    } else {
      this.cart.push({ ...product });
    }

    alert('Added to cart');
  }
}