import { Injectable } from '@angular/core';
import { Product } from './product';

interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {

  cartItems: CartItem[] = [];

  addToCart(product: Product) {

    const item = this.cartItems.find(
      i => i.product.id === product.id
    );

    if (item) {
      item.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) =>
      total + item.product.price * item.quantity, 0
    );
  }

}