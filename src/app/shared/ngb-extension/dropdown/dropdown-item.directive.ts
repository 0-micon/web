// tslint:disable: use-host-property-decorator

import { Directive, Input, HostBinding, ElementRef } from '@angular/core';

/**
 * A directive you should put on a dropdown item to enable keyboard navigation.
 * Arrow keys will move focus between items marked with this directive.
 */
@Directive({
  selector: '[appDropdownItem]',
  host: {
    '[class.dropdown-item]': 'true'
  }
})
export class DropdownItemDirective {
  private _disabled = false;

  @Input()
  @HostBinding('class.disabled')
  set disabled(value: boolean) {
    this._disabled = (value as any) === '' || value === true; // accept an empty attribute as true
  }

  get disabled(): boolean {
    return this._disabled;
  }

  constructor(private _elementRef: ElementRef<HTMLElement>) {}

  getNativeElement() {
    return this._elementRef.nativeElement;
  }
}
