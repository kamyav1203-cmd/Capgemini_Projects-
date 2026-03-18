import { Component } from '@angular/core';
import { ThemeDirective } from './theme.directive';

@Component({
  selector: 'app-root',
  imports: [ThemeDirective],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  currentTheme: 'dark' | 'light' = 'light';

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
  }
}
