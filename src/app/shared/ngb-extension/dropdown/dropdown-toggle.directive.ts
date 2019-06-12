// tslint:disable: use-host-property-decorator
import { Directive, ElementRef, HostListener } from '@angular/core';

import { DropdownAnchorDirective } from './dropdown-anchor.directive';
import { DropdownDirective } from './dropdown.directive';

/**
 * A directive to mark an element that will toggle dropdown via the `click` event.
 *
 * You can also use `appDropdownAnchor` as an alternative.
 */
@Directive({
  selector: '[appDropdownToggle]',
  host: {
    '[class.dropdown-toggle]': 'true',
    'aria-haspopup': 'true'
  },
  providers: [{ provide: DropdownAnchorDirective, useExisting: DropdownToggleDirective }]
})
export class DropdownToggleDirective extends DropdownAnchorDirective {
  constructor(dropdown: DropdownDirective, elementRef: ElementRef<HTMLElement>) {
    super(dropdown, elementRef);
  }
  @HostListener('click') onclick() {
    this.dropdown.toggle();
  }
  @HostListener('keydown.ArrowUp', ['$event'])
  @HostListener('keydown.ArrowDown', ['$event'])
  @HostListener('keydown.Home', ['$event'])
  @HostListener('keydown.End', ['$event'])
  onKeydown(event: KeyboardEvent) {
    event.preventDefault();
    if (this.isOpen) {
      switch (event.code) {
        case 'ArrowUp':
        case 'End':
          this.dropdown.setFocusOnMenu('last');
          break;
        case 'ArrowDown':
        case 'Home':
          this.dropdown.setFocusOnMenu('first');
          break;
      }
    } else {
      this.dropdown.open();
    }
  }
}
