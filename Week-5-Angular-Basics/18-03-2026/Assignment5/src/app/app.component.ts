import { Component } from '@angular/core';
import { StatusColorDirective } from './status-color.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [StatusColorDirective, CommonModule],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  students = [
    { name: 'John', marks: 75 },
    { name: 'Mary', marks: 45 },
    { name: 'David', marks: 60 },
    { name: 'Sarah', marks: 30 },
    { name: 'Mike', marks: 85 },
    { name: 'Lisa', marks: 48 }
  ];
}
