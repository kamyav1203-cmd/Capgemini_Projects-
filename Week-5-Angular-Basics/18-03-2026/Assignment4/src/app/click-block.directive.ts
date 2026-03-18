import { Directive, ElementRef, Input, OnInit, OnChanges, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickBlock]',
  standalone: true
})
export class ClickBlockDirective implements OnInit, OnChanges {
  @Input() appClickBlock: boolean = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.updateState();
  }

  ngOnChanges() {
    this.updateState();
  }

  updateState() {
    if (!this.appClickBlock) {
      this.el.nativeElement.style.pointerEvents = 'none';
      this.el.nativeElement.style.opacity = '0.5';
    } else {
      this.el.nativeElement.style.pointerEvents = 'auto';
      this.el.nativeElement.style.opacity = '1';
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (!this.appClickBlock) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
