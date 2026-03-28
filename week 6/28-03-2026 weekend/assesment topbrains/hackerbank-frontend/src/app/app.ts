import { Component } from '@angular/core';
import { RecordTableComponent } from './record-table/record-table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RecordTableComponent],
  template: `<app-record-table></app-record-table>`
})
export class App {}