import { Directive, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DropdownBaseDirective } from './dropdown-base.directive';

/**
 * A directive that helps to select an item in the dropdown menu.
 * It postpones an item selection till the drop is open.
 */
@Directive({
  selector: '[appDropdownItemSelector]'
})
export class DropdownItemSelectorDirective implements OnDestroy {
  private _openChangeSubscription: Subscription;
  private _selectedItem = -1;
  private _selectOnOpen = false;

  @Input()
  set selectedItem(value: number) {
    this._selectedItem = value;
    this._select();
  }

  @Output() selectedItemChange = new EventEmitter<number>();

  private _select() {
    setTimeout(() => {
      if (this.dropdown.opened) {
        this.selectedItemChange.emit(this._selectedItem);
        this._selectOnOpen = false;
      } else {
        this._selectOnOpen = true;
      }
    }, 0);
  }

  constructor(public dropdown: DropdownBaseDirective) {
    this._openChangeSubscription = dropdown.openedChange.subscribe(value => {
      if (value && this._selectOnOpen) {
        this._select();
      }
    });
  }

  ngOnDestroy() {
    if (this._openChangeSubscription) {
      this._openChangeSubscription.unsubscribe();
    }
  }
}
