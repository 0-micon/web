// tslint:disable: use-host-property-decorator

import { Directive, ElementRef, HostBinding } from '@angular/core';
import { DropdownBaseDirective } from './dropdown-base.directive';

/**
 * A directive to mark an element to which dropdown menu will be anchored.
 *
 * This is a simple version of the `appDropdownToggle` directive.
 * It plays the same role, but doesn't listen to click events to toggle dropdown menu thus enabling support
 * for events other than click.
 *
 * @since 1.1.0
 */
@Directive({
  selector: '[appDropdownAnchor]',
  host: {
    '[class.dropdown-toggle]': 'true',
    'aria-haspopup': 'true'
  }
})
export class DropdownAnchorDirective {
  constructor(
    public dropdown: DropdownBaseDirective,
    private _elementRef: ElementRef<HTMLElement>
  ) {}

  @HostBinding('attr.aria-expanded')
  get isOpen(): boolean {
    return this.dropdown && this.dropdown.opened;
  }

  getNativeElement() {
    return this._elementRef.nativeElement;
  }

  /**
   * Sets focus on the element, if it can be focused.
   */
  setFocus() {
    if (this._elementRef.nativeElement) {
      this._elementRef.nativeElement.focus();
    }
  }
}
