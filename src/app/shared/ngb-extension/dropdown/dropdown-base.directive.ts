import { Directive, Input, HostBinding, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDropdownBase]',
  exportAs: 'appDropdownBase'
})
export class DropdownBaseDirective {
  /**
   * An event fired when the dropdown is opened or closed.
   *
   * The event payload is a `boolean`:
   * * `true` - the dropdown was opened
   * * `false` - the dropdown was closed
   */
  @Output() openedChange = new EventEmitter<boolean>();

  private _opened = false;

  /**
   * Defines whether or not the dropdown menu is opened initially.
   */
  @Input()
  @HostBinding('class.show')
  get opened() {
    return this._opened;
  }

  set opened(value: boolean) {
    if (value) {
      if (!this._opened) {
        this.open();
      }
    } else {
      if (this._opened) {
        this.close();
      }
    }
  }

  constructor() {}

  toggle() {
    this.opened = !this._opened;
  }

  open() {
    if (!this._opened) {
      this._opened = true;
      this.openedChange.emit(true);
    }
  }

  close() {
    if (this._opened) {
      this._opened = false;
      this.openedChange.emit(false);
    }
  }

  setFocusOnAnchor() {}
  setFocusOnMenu(command: string) {}
}
