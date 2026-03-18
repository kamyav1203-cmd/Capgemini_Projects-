import { Component } from '@angular/core';
import { PriceHighlightDirective } from './price-highlight.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [PriceHighlightDirective, CommonModule],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  products = [
    { name: 'Laptop', price: 75000 },
    { name: 'Smartphone', price: 25000 },
    { name: 'Tablet', price: 45000 },
    { name: 'Desktop PC', price: 85000 },
    { name: 'Headphones', price: 5000 }
  ];
}
