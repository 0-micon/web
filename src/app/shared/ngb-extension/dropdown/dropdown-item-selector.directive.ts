import { Directive, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DropdownDirective } from './dropdown.directive';

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
      if (this.dropdown.isOpen()) {
        this.selectedItemChange.emit(this._selectedItem);
        this._selectOnOpen = false;
      } else {
        this._selectOnOpen = true;
      }
    }, 0);
  }

  constructor(public dropdown: DropdownDirective) {
    this._openChangeSubscription = dropdown.openChange.subscribe(value => {
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
