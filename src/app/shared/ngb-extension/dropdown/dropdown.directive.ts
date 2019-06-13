// tslint:disable: use-host-property-decorator
// tslint:disable: no-use-before-declare

import {
  Directive,
  Input,
  ElementRef,
  HostBinding,
  ContentChildren,
  QueryList,
  Inject,
  forwardRef,
  OnInit,
  OnDestroy,
  EventEmitter,
  ChangeDetectorRef,
  Output,
  Renderer2,
  NgZone,
  SimpleChanges,
  ContentChild,
  HostListener,
  OnChanges,
  Injectable
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Subject, Subscription } from 'rxjs';
import { Placement, PlacementArray, positionElements } from '../utils/positioning';
import { ngbAutoClose } from '../utils/autoclose';
import { DropdownItemDirective } from './dropdown-item.directive';
import { DropdownMenuBaseDirective } from './dropdown-menu-base.directive';

/**
 * A directive you should put on a dropdown item to enable keyboard navigation.
 * Arrow keys will move focus between items marked with this directive.
 */
// @Directive({
//   selector: '[appDropdownItem]',
//   host: {
//     '[class.dropdown-item]': 'true'
//   }
// })
// export class DropdownItemDirective {
//   private _disabled = false;

//   @Input()
//   @HostBinding('class.disabled')
//   set disabled(value: boolean) {
//     this._disabled = (value as any) === '' || value === true; // accept an empty attribute as true
//   }

//   get disabled(): boolean {
//     return this._disabled;
//   }

//   constructor(private _elementRef: ElementRef<HTMLElement>) {}

//   getNativeElement() {
//     return this._elementRef.nativeElement;
//   }
// }

// /**
//  * A directive for a dropdown menu content.
//  */
// @Directive({
//   selector: '[appDropdownMenuBase]',
//   host: {
//     '[class.dropdown-menu]': 'true'
//   }
// })
// export class DropdownMenuBaseDirective {
//   @HostBinding('attr.x-placement')
//   placement: Placement = 'bottom';

//   @HostBinding('class.show')
//   get isOpen(): boolean {
//     return this.dropdown.isOpen();
//   }

//   @Output()
//   itemFocusRequest = new EventEmitter<string>();

//   constructor(
//     @Inject(forwardRef(() => DropdownDirective)) public dropdown: DropdownDirective,
//     private _elementRef: ElementRef<HTMLElement>
//   ) {}

//   getNativeElement() {
//     return this._elementRef.nativeElement;
//   }

//   setFocus(item: 'first' | 'last' | 'next' | 'prev') {
//     this.itemFocusRequest.emit(item);
//   }
// }

// /**
//  * A directive that wraps dropdown menu content and dropdown items.
//  */
// @Directive({
//   selector: '[appDropdownMenu]',
//   exportAs: 'appDropdownMenu',
//   host: {
//     '[class.dropdown-menu]': 'true'
//   },
//   providers: [
//     { provide: DropdownMenuBaseDirective, useExisting: forwardRef(() => DropdownMenuDirective) }
//   ]
// })
// export class DropdownMenuDirective extends DropdownMenuBaseDirective {
//   @ContentChildren(DropdownItemDirective) menuItems: QueryList<DropdownItemDirective>;
//   @Input()
//   set scrollToItem(value: number) {
//     if (this.isOpen && value >= 0) {
//       const items = this.menuItems.toArray();
//       if (value < items.length) {
//         const elem = items[value].getNativeElement();
//         if (elem && elem.scrollIntoView) {
//           setTimeout(() => {
//             elem.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
//           }, 0);
//         }
//       }
//     }
//   }

//   constructor(
//     elementRef: ElementRef<HTMLElement>
//   ) {
//     super(elementRef);
//   }

//   setFocus(commands: 'first' | 'last' | 'next' | 'prev') {
//     super.setFocus(commands);

//     const itemElements = this.menuItems
//       .filter(item => !item.disabled)
//       .map(item => item.getNativeElement());
//     if (itemElements) {
//       let position = 0; // default to the first element.
//       if (commands === 'last') {
//         position = itemElements.length - 1;
//       } else if (commands === 'next' || commands === 'prev') {
//         const activeElement = document ? document.activeElement : null;
//         // const activeElement = this.dropdown.getActiveElement();
//         for (position = itemElements.length; position-- > 0; ) {
//           if (itemElements[position] === activeElement) {
//             break;
//           }
//         }
//         if (commands === 'next') {
//           position = Math.min(position + 1, itemElements.length - 1);
//         } else {
//           position = Math.max(position - 1, 0);
//         }
//       }
//       itemElements[position].focus();
//     }
//   }

//   @HostListener('keydown.ArrowUp', ['$event'])
//   @HostListener('keydown.ArrowDown', ['$event'])
//   @HostListener('keydown.Home', ['$event'])
//   @HostListener('keydown.End', ['$event'])
//   onKeyDown(event: KeyboardEvent) {
//     event.preventDefault();
//     switch (event.code) {
//       case 'Down': // IE/Edge specific value
//       case 'ArrowDown':
//         this.setFocus('next');
//         break;
//       case 'Up': // IE/Edge specific value
//       case 'ArrowUp':
//         this.setFocus('prev');
//         break;
//       case 'Home':
//         this.setFocus('first');
//         break;
//       case 'End':
//         this.setFocus('last');
//         break;
//     }
//   }
// }

/**
 * A directive to mark an element to which dropdown menu will be anchored.
 *
 * This is a simple version of the `NgbDropdownToggle` directive.
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
    @Inject(forwardRef(() => DropdownDirective)) public dropdown: DropdownDirective,
    private _elementRef: ElementRef<HTMLElement>
  ) {}

  @HostBinding('attr.aria-expanded')
  get isOpen(): boolean {
    return this.dropdown.isOpen();
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
  providers: [
    { provide: DropdownAnchorDirective, useExisting: forwardRef(() => DropdownToggleDirective) }
  ]
})
export class DropdownToggleDirective extends DropdownAnchorDirective {
  constructor(
    @Inject(forwardRef(() => DropdownDirective)) dropdown: DropdownDirective,
    elementRef: ElementRef<HTMLElement>
  ) {
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

/**
 * A directive that provides contextual overlays for displaying lists of links and more.
 */
@Directive({
  selector: '[appDropdown]',
  exportAs: 'appDropdown'
})
export class DropdownDirective implements OnInit, OnDestroy, OnChanges {
  private _closed$ = new Subject<void>();
  private _zoneSubscription: Subscription;

  @ContentChild(DropdownMenuBaseDirective) private _menu: DropdownMenuBaseDirective;
  @ContentChild(DropdownAnchorDirective) private _anchor: DropdownAnchorDirective;

  /**
   * Indicates whether the dropdown should be closed when clicking one of dropdown items or pressing ESC.
   *
   * * `true` - the dropdown will close on both outside and inside (menu) clicks.
   * * `false` - the dropdown can only be closed manually via `close()` or `toggle()` methods.
   * * `"inside"` - the dropdown will close on inside menu clicks, but not outside clicks.
   * * `"outside"` - the dropdown will close only on the outside clicks and not on menu clicks.
   */
  @Input() autoClose: boolean | 'outside' | 'inside' = true;

  /**
   * Defines whether or not the dropdown menu is opened initially.
   */
  // tslint:disable-next-line: no-input-rename
  @HostBinding('class.show')
  @Input('open')
  _open = false;

  /**
   * The preferred placement of the dropdown.
   *
   * Possible values are `"top"`, `"top-left"`, `"top-right"`, `"bottom"`, `"bottom-left"`,
   * `"bottom-right"`, `"left"`, `"left-top"`, `"left-bottom"`, `"right"`, `"right-top"`,
   * `"right-bottom"`
   *
   * Accepts an array of strings or a string with space separated possible values.
   *
   * The default order of preference is `"bottom-left bottom-right top-left top-right"`
   */
  @Input() placement: PlacementArray = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];

  /**
   * An event fired when the dropdown is opened or closed.
   *
   * The event payload is a `boolean`:
   * * `true` - the dropdown was opened
   * * `false` - the dropdown was closed
   */
  @Output() openChange = new EventEmitter<boolean>();

  constructor(
    private _changeDetector: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any,
    private _ngZone: NgZone,
    private _elementRef: ElementRef<HTMLElement>,
    private _renderer: Renderer2
  ) {
    this._zoneSubscription = _ngZone.onStable.subscribe(() => {
      this._positionMenu();
    });
  }

  ngOnInit() {
    this._applyPlacementClasses();
    if (this._open) {
      this._setCloseHandlers();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.placement && !changes.placement.isFirstChange) {
      this._applyPlacementClasses();
    }
  }

  /**
   * Checks if the dropdown menu is open.
   */
  isOpen(): boolean {
    return this._open;
  }

  /**
   * Opens the dropdown menu.
   */
  open(): void {
    if (!this._open) {
      this._open = true;
      this._updateMenu();
      this._applyContainer();
      this.openChange.emit(true);
      this._setCloseHandlers();
    }
  }

  private _setCloseHandlers() {
    ngbAutoClose(
      this._ngZone,
      this._document,
      this.autoClose,
      () => this.close(),
      this._closed$,
      this._menu ? [this._menu.getNativeElement()] : [],
      this._anchor ? [this._anchor.getNativeElement()] : [],
      '.dropdown-item,.dropdown-divider'
    );
  }

  private _isMenuActive(): boolean {
    if (this._menu && this._document) {
      const elem = this._menu.getNativeElement();
      if (elem) {
        return elem.contains(this._document.activeElement);
      }
    }
    return false;
  }

  getActiveElement() {
    return this._document.activeElement;
  }

  /**
   * Sets focus on the anchor, if it can be focused.
   */
  setFocusOnAnchor() {
    if (this._anchor) {
      this._anchor.setFocus();
    }
  }

  /**
   * Sets focus on the specific menu item, if it can be focused.
   */
  setFocusOnMenu(menuItem: 'first' | 'last' | 'prev' | 'next' = 'first') {
    if (this._menu) {
      this._menu.setFocus(menuItem);
    }
  }

  private _updateMenu() {
    if (this._menu) {
      this._menu.isOpen = this._open;
    }
  }

  /**
   * Closes the dropdown menu.
   */
  close(): void {
    if (this._open) {
      // Transfer focus from menu to anchor.
      if (this._isMenuActive()) {
        this.setFocusOnAnchor();
      }

      this._open = false;
      this._updateMenu();
      this._resetContainer();
      this._closed$.next();
      this.openChange.emit(false);
      this._changeDetector.markForCheck();
    }
  }

  /**
   * Toggles the dropdown menu.
   */
  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  ngOnDestroy() {
    this._resetContainer();

    this._closed$.next();
    this._zoneSubscription.unsubscribe();
  }

  isDropup(): boolean {
    return this._elementRef.nativeElement.classList.contains('dropup');
  }

  private _positionMenu() {
    if (this.isOpen() && this._menu) {
      this._applyPlacementClasses(
        positionElements(
          this._anchor.getNativeElement(),
          this._menu.getNativeElement(),
          this.placement,
          false
        )
      );
    }
  }

  private _resetContainer() {
    const renderer = this._renderer;
    if (this._menu) {
      const dropdownElement = this._elementRef.nativeElement;
      const dropdownMenuElement = this._menu.getNativeElement();

      if (!dropdownElement.contains(dropdownMenuElement)) {
        renderer.appendChild(dropdownElement, dropdownMenuElement);
      }

      renderer.removeStyle(dropdownMenuElement, 'position');
      renderer.removeStyle(dropdownMenuElement, 'transform');
    }
  }

  private _applyContainer() {
    this._resetContainer();
  }

  private _applyPlacementClasses(placement?: Placement) {
    if (this._menu) {
      if (!placement) {
        placement = Array.isArray(this.placement)
          ? this.placement[0]
          : (this.placement.split(' ')[0] as Placement);
      }

      const renderer = this._renderer;
      const dropdownElement = this._elementRef.nativeElement;

      // remove the current placement classes
      renderer.removeClass(dropdownElement, 'dropup');
      renderer.removeClass(dropdownElement, 'dropdown');
      this._menu.placement = placement;

      /*
       * apply the new placement
       * in case of top use up-arrow or down-arrow otherwise
       */
      const dropdownClass = placement.search('^top') !== -1 ? 'dropup' : 'dropdown';
      renderer.addClass(dropdownElement, dropdownClass);
    }
  }
}

// /**
//  * A directive that helps to select an item in the dropdown menu.
//  * It postpones an item selection till the drop is open.
//  */
// @Directive({
//   selector: '[appDropdownItemSelector]'
// })
// export class DropdownItemSelectorDirective implements OnDestroy {
//   private _openChangeSubscription: Subscription;
//   private _selectedItem = -1;
//   private _selectOnOpen = false;

//   @Input()
//   set selectedItem(value: number) {
//     this._selectedItem = value;
//     this._select();
//   }

//   @Output() selectedItemChange = new EventEmitter<number>();

//   private _select() {
//     setTimeout(() => {
//       if (this.dropdown.isOpen()) {
//         this.selectedItemChange.emit(this._selectedItem);
//         this._selectOnOpen = false;
//       } else {
//         this._selectOnOpen = true;
//       }
//     }, 0);
//   }

//   constructor(public dropdown: DropdownDirective) {
//     this._openChangeSubscription = dropdown.openChange.subscribe(value => {
//       if (value && this._selectOnOpen) {
//         this._select();
//       }
//     });
//   }

//   ngOnDestroy() {
//     if (this._openChangeSubscription) {
//       this._openChangeSubscription.unsubscribe();
//     }
//   }
// }
