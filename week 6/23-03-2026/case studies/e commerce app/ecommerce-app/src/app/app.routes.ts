import { Routes } from '@angular/router';
import { ProductList } from './product-list/product-list';
import { CartComponent } from './cart/cart';
import { CheckoutComponent } from './checkout/checkout';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent }
];