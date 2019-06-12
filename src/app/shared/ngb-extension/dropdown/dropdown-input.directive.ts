// tslint:disable: use-host-property-decorator
// tslint:disable: object-literal-key-quotes

import {
  Directive,
  forwardRef,
  Inject,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { DropdownAnchorDirective } from './dropdown-anchor.directive';
import { DropdownDirective } from './dropdown.directive';

@Directive({
  selector: '[appDropdownInput]',
  host: {
    '[class.dropdown-toggle]': 'true',
    'aria-haspopup': 'true',
    autocomplete: 'off',
    autocorrect: 'off',
    autocapitalize: 'off',
    spellcheck: 'false'
  },
  providers: [
    { provide: DropdownAnchorDirective, useExisting: forwardRef(() => DropdownInputDirective) }
  ]
})
export class DropdownInputDirective extends DropdownAnchorDirective {
  @Input('appDropdownInput') selection = -1;
  @Output() appDropdownInputChange = new EventEmitter<number>();

  /**
   * Number of elements/items in the dropdown menu collection. i.e. the total number of items the input should handle.
   * The default value is `0`.
   */
  @Input() itemCount = 0;

  /**
   * Number of elements/items per page.
   * The default value is `5`.
   */
  @Input() pageSize = 5;

  requestSelectionChange(value: number) {
    this.appDropdownInputChange.emit(value);
  }

  constructor(
    @Inject(forwardRef(() => DropdownDirective)) dropdown: DropdownDirective,
    elementRef: ElementRef<HTMLElement>
  ) {
    super(dropdown, elementRef);
  }

  @HostListener('focus')
  @HostListener('keyup.ArrowDown')
  open() {
    if (!this.isOpen) {
      this.dropdown.open();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (!this.isOpen) {
      return;
    }

    const minIndex = 0;
    const maxIndex = this.itemCount - 1;
    const delta = this.pageSize;
    const selection = this.selection;

    switch (event.key) {
      // Scroll the content by one line at a time.
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        if (selection < maxIndex) {
          event.preventDefault();
          if (event.ctrlKey) {
            this.requestSelectionChange(maxIndex);
          } else {
            this.requestSelectionChange(selection + 1);
          }
        }
        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        if (selection > minIndex) {
          event.preventDefault();
          if (event.ctrlKey) {
            this.requestSelectionChange(minIndex);
          } else {
            this.requestSelectionChange(selection - 1);
          }
        }
        break;
      // Page by page scrolling.
      case 'PageDown':
        if (selection < maxIndex) {
          event.preventDefault();
          this.requestSelectionChange(Math.min(selection + delta, maxIndex));
        }
        break;
      case 'PageUp':
        if (selection > minIndex) {
          event.preventDefault();
          this.requestSelectionChange(Math.max(selection - delta, minIndex));
        }
        break;
    }
  }
}
