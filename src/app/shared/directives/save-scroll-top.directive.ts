import {
  Directive,
  Input,
  ElementRef,
  OnChanges,
  HostListener,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[appSaveScrollTop]'
})
export class SaveScrollTopDirective implements OnChanges {
  private _savedScrollTop = 0;

  @Input('appSaveScrollTop') enabled: boolean;

  constructor(private _elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    const changeEnabled = changes.enabled;
    if (changeEnabled) {
      if (!changeEnabled.firstChange) {
        if (changeEnabled.currentValue && !changeEnabled.previousValue) {
          this.restore();
        }
      }
    }
  }

  restore() {
    const elem: HTMLElement = this._elementRef.nativeElement;
    if (elem) {
      setTimeout(() => {
        if (elem.scrollTop !== this._savedScrollTop) {
          elem.scrollTop = this._savedScrollTop;
        }
      }, 0);
    }
  }

  @HostListener('scroll') save() {
    if (this.enabled) {
      const elem: HTMLElement = this._elementRef.nativeElement;
      if (elem) {
        this._savedScrollTop = elem.scrollTop;
      }
    }
  }

  scrollIntoView(p: number, q: number) {
    if (this.enabled) {
      const elem: HTMLElement = this._elementRef.nativeElement;
      if (elem) {
        const clientH = elem.clientHeight;
        const scrollH = elem.scrollHeight;

        // const deltaY = totalH / q;
        const yMin = (scrollH * p) / q;
        const yMax = (scrollH * (p - 1)) / q + clientH;
        if (elem.scrollTop < yMin) {
          this._savedScrollTop = yMin;
          this.restore();
        } else if (elem.scrollTop > yMax) {
          this._savedScrollTop = yMax;
          this.restore();
        }
      }
    }
  }
}
