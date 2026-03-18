import { Directive, ElementRef, Input, OnInit, OnChanges } from '@angular/core';

@Directive({
  selector: '[appStatusColor]',
  standalone: true
})
export class StatusColorDirective implements OnInit, OnChanges {
  @Input() appStatusColor: number = 0;
  @Input() passingMarks: number = 50;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.applyColor();
  }

  ngOnChanges() {
    this.applyColor();
  }

  applyColor() {
    if (this.appStatusColor >= this.passingMarks) {
      this.el.nativeElement.style.color = 'green';
      this.el.nativeElement.style.fontWeight = 'bold';
    } else {
      this.el.nativeElement.style.color = 'red';
      this.el.nativeElement.style.fontWeight = 'bold';
    }
  }
}
