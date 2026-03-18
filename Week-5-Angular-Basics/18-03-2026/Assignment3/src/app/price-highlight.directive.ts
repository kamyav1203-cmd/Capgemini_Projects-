import { Directive, ElementRef, Input, OnInit, OnChanges } from '@angular/core';

@Directive({
  selector: '[appPriceHighlight]',
  standalone: true
})
export class PriceHighlightDirective implements OnInit, OnChanges {
  @Input() appPriceHighlight: number = 0;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.applyHighlight();
  }

  ngOnChanges() {
    this.applyHighlight();
  }

  applyHighlight() {
    if (this.appPriceHighlight > 50000) {
      this.el.nativeElement.style.color = 'red';
      this.el.nativeElement.style.fontWeight = 'bold';
    } else {
      this.el.nativeElement.style.color = 'green';
      this.el.nativeElement.style.fontWeight = 'bold';
    }
  }
}
