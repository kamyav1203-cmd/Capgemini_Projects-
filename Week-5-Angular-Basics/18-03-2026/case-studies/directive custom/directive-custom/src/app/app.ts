import { Component } from '@angular/core';
import { HighlightDirective } from './highlight';

@Component({
  selector: 'app-root',
  imports: [HighlightDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'directives-custom';
}