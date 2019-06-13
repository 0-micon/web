// tslint:disable: use-host-property-decorator

import {
  Directive,
  ContentChildren,
  QueryList,
  ElementRef,
  Input,
  HostListener,
  forwardRef
} from '@angular/core';

import { DropdownItemDirective } from './dropdown-item.directive';
import { DropdownMenuBaseDirective } from './dropdown-menu-base.directive';

/**
 * A directive that wraps dropdown menu content and dropdown items.
 */
@Directive({
  selector: '[appDropdownMenu]',
  exportAs: 'appDropdownMenu',
  host: {
    '[class.dropdown-menu]': 'true'
  },
  providers: [
    { provide: DropdownMenuBaseDirective, useExisting: forwardRef(() => DropdownMenuDirective) }
  ]
})
export class DropdownMenuDirective extends DropdownMenuBaseDirective {
  @ContentChildren(DropdownItemDirective) menuItems: QueryList<DropdownItemDirective>;
  @Input()
  set scrollToItem(value: number) {
    if (this.isOpen && value >= 0) {
      const items = this.menuItems.toArray();
      if (value < items.length) {
        const elem = items[value].getNativeElement();
        if (elem && elem.scrollIntoView) {
          setTimeout(() => {
            elem.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
          }, 0);
        }
      }
    }
  }

  constructor(elementRef: ElementRef<HTMLElement>) {
    super(elementRef);
  }

  setFocus(commands: 'first' | 'last' | 'next' | 'prev') {
    super.setFocus(commands);

    const itemElements = this.menuItems
      .filter(item => !item.disabled)
      .map(item => item.getNativeElement());
    if (itemElements) {
      let position = 0; // default to the first element.
      if (commands === 'last') {
        position = itemElements.length - 1;
      } else if (commands === 'next' || commands === 'prev') {
        const activeElement = document ? document.activeElement : null;
        // const activeElement = this.dropdown.getActiveElement();
        for (position = itemElements.length; position-- > 0; ) {
          if (itemElements[position] === activeElement) {
            break;
          }
        }
        if (commands === 'next') {
          position = Math.min(position + 1, itemElements.length - 1);
        } else {
          position = Math.max(position - 1, 0);
        }
      }
      itemElements[position].focus();
    }
  }

  @HostListener('keydown.ArrowUp', ['$event'])
  @HostListener('keydown.ArrowDown', ['$event'])
  @HostListener('keydown.Home', ['$event'])
  @HostListener('keydown.End', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    switch (event.code) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        this.setFocus('next');
        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        this.setFocus('prev');
        break;
      case 'Home':
        this.setFocus('first');
        break;
      case 'End':
        this.setFocus('last');
        break;
    }
  }
}
