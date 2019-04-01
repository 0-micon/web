import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: '[appSetFocus]'
})
export class SetFocusDirective implements AfterViewInit {
  @Input('appSetFocus') delay: number = 0;

  constructor(private _el: ElementRef) {}

  ngAfterViewInit(): void {
    const nativeElement: HTMLElement = this._el.nativeElement;
    if (nativeElement) {
      const delay = +this.delay;
      setTimeout(() => nativeElement.focus(), delay > 0 ? delay : 0);
    }
  }
}
