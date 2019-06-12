// tslint:disable: use-host-property-decorator

import { Directive, HostBinding, Output, EventEmitter, ElementRef } from '@angular/core';
import { Placement } from '@ng-bootstrap/ng-bootstrap';
import { DropdownDirective } from './dropdown.directive';

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
  get isOpen(): boolean {
    return this.dropdown.isOpen();
  }

  @Output()
  itemFocusRequest = new EventEmitter<string>();

  constructor(public dropdown: DropdownDirective, private _elementRef: ElementRef<HTMLElement>) {}

  getNativeElement() {
    return this._elementRef.nativeElement;
  }

  setFocus(command: string) {
    this.itemFocusRequest.emit(command);
  }
}
