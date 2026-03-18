import { Component } from '@angular/core';
import { ClickBlockDirective } from './click-block.directive';

@Component({
  selector: 'app-root',
  imports: [ClickBlockDirective],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  isClickEnabled: boolean = false;
  message: string = 'Button is currently blocked';

  toggleClickEnabled() {
    this.isClickEnabled = !this.isClickEnabled;
    this.message = this.isClickEnabled ? 'Button is now enabled' : 'Button is currently blocked';
  }

  handleClick() {
    this.message = 'Button clicked successfully!';
  }
}
