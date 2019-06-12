// tslint:disable: use-host-property-decorator

import {
  Directive,
  OnInit,
  OnDestroy,
  OnChanges,
  ContentChild,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Inject,
  NgZone,
  ElementRef,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Subject, Subscription } from 'rxjs';

import { Placement } from '@ng-bootstrap/ng-bootstrap';
import { PlacementArray, positionElements } from '@ng-bootstrap/ng-bootstrap/util/positioning';

import { ngbAutoClose } from '../utils/autoclose';

import { DropdownAnchorDirective } from './dropdown-anchor.directive';
import { DropdownMenuBaseDirective } from './dropdown-menu-base.directive';

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
