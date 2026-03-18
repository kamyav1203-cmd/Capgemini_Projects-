import { Directive, ElementRef, Input, OnInit, OnChanges } from '@angular/core';

@Directive({
  selector: '[appTheme]',
  standalone: true
})
export class ThemeDirective implements OnInit, OnChanges {
  @Input() appTheme: 'dark' | 'light' = 'light';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.applyTheme();
  }

  ngOnChanges() {
    this.applyTheme();
  }

  applyTheme() {
    if (this.appTheme === 'dark') {
      this.el.nativeElement.style.backgroundColor = '#333';
      this.el.nativeElement.style.color = '#fff';
    } else {
      this.el.nativeElement.style.backgroundColor = '#fff';
      this.el.nativeElement.style.color = '#333';
    }
    this.el.nativeElement.style.padding = '20px';
  }
}
