import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Contact } from './contact/contact';
import { Product } from './product/product';
import { ProductDetail } from './product-detail/product-detail';
import { ProductGuardService } from './product-guard-service';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'contact', component: Contact },
  { path: 'product', component: Product },

  {
    path: 'product/:id',
    component: ProductDetail,
    canActivate: [ProductGuardService]
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' }
];