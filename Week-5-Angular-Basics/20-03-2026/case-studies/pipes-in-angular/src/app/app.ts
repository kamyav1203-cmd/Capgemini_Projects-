import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe, DatePipe, KeyValuePipe } from '@angular/common';
import { of } from 'rxjs';
import { CustomCurrencyPipe } from './custom-currency-pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    DatePipe,
    KeyValuePipe,
    CustomCurrencyPipe
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  today = new Date();

  data$ = of([
    {
      id: 1,
      productName: 'Laptop',
      price: 50000,
      status: 'Delivered'
    },
    {
      id: 2,
      productName: 'Mobile',
      price: 20000,
      status: 'Pending'
    }
  ]);

  product = {
    name: 'Laptop',
    price: 50000
  };
}