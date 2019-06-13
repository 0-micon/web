// tslint:disable: use-host-property-decorator

import {
  Directive,
  HostBinding,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';

import { Placement } from '@ng-bootstrap/ng-bootstrap';

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
  isOpen = false;

  @Output()
  itemFocusRequest = new EventEmitter<string>();

  constructor(private _elementRef: ElementRef<HTMLElement>) {}

  getNativeElement() {
    return this._elementRef.nativeElement;
  }

  setFocus(item: 'first' | 'last' | 'next' | 'prev') {
    this.itemFocusRequest.emit(item);
  }
}
