import { Component } from '@angular/core';
import { OrderParent } from './order_parent';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [OrderParent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'signal-lifecycle-demo';
}