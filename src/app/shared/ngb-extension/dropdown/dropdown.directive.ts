// tslint:disable: use-host-property-decorator
// tslint:disable: no-use-before-declare

import {
  Directive,
  Input,
  ElementRef,
  Inject,
  forwardRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Renderer2,
  NgZone,
  SimpleChanges,
  ContentChild,
  OnChanges
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Subject, Subscription } from 'rxjs';

import { Placement, PlacementArray, positionElements } from '../utils/positioning';
import { ngbAutoClose } from '../utils/autoclose';

import { DropdownMenuBaseDirective } from './dropdown-menu-base.directive';
import { DropdownAnchorDirective } from './dropdown-anchor.directive';
import { DropdownBaseDirective } from './dropdown-base.directive';

/**
 * A directive that provides contextual overlays for displaying lists of links and more.
 */
@Directive({
  selector: '[appDropdown]',
  exportAs: 'appDropdown',
  providers: [{ provide: DropdownBaseDirective, useExisting: forwardRef(() => DropdownDirective) }]
})
export class DropdownDirective extends DropdownBaseDirective
  implements OnInit, OnDestroy, OnChanges {
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

  constructor(
    private _changeDetector: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any,
    private _ngZone: NgZone,
    private _elementRef: ElementRef<HTMLElement>,
    private _renderer: Renderer2
  ) {
    super();
    this._zoneSubscription = _ngZone.onStable.subscribe(() => {
      this._positionMenu();
    });
  }

  ngOnInit() {
    this._applyPlacementClasses();
    if (this.opened) {
      this._setCloseHandlers();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.placement && !changes.placement.isFirstChange) {
      this._applyPlacementClasses();
    }
  }

  /**
   * Opens the dropdown menu.
   */
  open(): void {
    if (!this.opened) {
      this._applyContainer();
      this._setCloseHandlers();
      super.open();
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
    if (this.opened) {
      // Transfer focus from menu to anchor.
      if (this._isMenuActive()) {
        this.setFocusOnAnchor();
      }

      this._resetContainer();
      this._closed$.next();
      this._changeDetector.markForCheck();

      super.close();
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
    if (this.opened && this._menu) {
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
