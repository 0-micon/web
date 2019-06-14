// tslint:disable: use-host-property-decorator

import { Directive, HostBinding, Output, EventEmitter, ElementRef } from '@angular/core';

import { DropdownBaseDirective } from './dropdown-base.directive';
import { Placement } from '../utils/positioning';

/**
 * A directive for a dropdown menu content.
 */
@Directive({
  selector: '[appDropdownMenuBase]',
  host: {
    '[class.dropdown-menu]': 'true'
  }
})
export class DropdownMenuBaseDirective {
  @HostBinding('attr.x-placement')
  placement: Placement = 'bottom';

  @HostBinding('class.show')
  get isOpen() {
    return this.dropdown && this.dropdown.opened;
  }

  @Output()
  itemFocusRequest = new EventEmitter<string>();

  constructor(
    public dropdown: DropdownBaseDirective,
    private _elementRef: ElementRef<HTMLElement>
  ) {}

  getNativeElement() {
    return this._elementRef.nativeElement;
  }

  setFocus(item: 'first' | 'last' | 'next' | 'prev') {
    this.itemFocusRequest.emit(item);
  }
}
