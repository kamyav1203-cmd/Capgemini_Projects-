import { Routes } from '@angular/router';
import { Products } from './products/products';
import { Cart } from './cart/cart';

export const routes: Routes = [
  { path: '', component: Products },
  { path: 'cart', component: Cart }
];