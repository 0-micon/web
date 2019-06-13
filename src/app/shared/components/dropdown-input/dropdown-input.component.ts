import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DropdownDirective } from '../../ngb-extension/dropdown/dropdown.directive';

function lowerBound(
  items: string[],
  value: string,
  locales?: string | string[],
  options?: Intl.CollatorOptions
): number {
  let first = 0;
  let last = items.length - 1;

  while (first <= last) {
    const i = Math.floor((last + first) / 2);
    const n = value.localeCompare(items[i], locales, options);
    if (n < 0) {
      last = i - 1;
    } else if (n > 0) {
      first = i + 1;
    } else {
      return i;
    }
  }
  return last + 1;
}

@Component({
  selector: 'app-dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['./dropdown-input.component.scss']
})
export class DropdownInputComponent implements OnInit {
  @Input() placeholder = '';
  @Input() items: string[] = [];
  @Input() names: string[];
  @Input() helps: string[];

  @ViewChild('drop') drop: DropdownDirective;
  // @ViewChild('list') list: SimpleVirtualListComponent;

  private _selection = -1;

  get selection() {
    return this._selection;
  }

  set selection(value: number) {
    if (this._selection !== value) {
      this._selection = value;
    }
  }

  private _model = '';
  @Input()
  set model(value: string) {
    if (this._model !== value) {
      this._model = value;

      if (this.items && value) {
        this.selection = lowerBound(this.items, value);
      } else {
        this.selection = -1;
      }

      this.modelChange.emit(value);
    }
  }

  get model() {
    return this._model;
  }

  @Output() modelChange = new EventEmitter<string>();

  onItemClick(index: number) {
    this.modelChange.emit(this.items[index]);
    if (this.drop.isOpen()) {
      this.drop.close();
    }
  }

  onInputEnter() {
    if (this.drop.isOpen()) {
      if (this.selection >= 0 && this.selection < this.items.length) {
        this.modelChange.emit(this.items[this.selection]);
      }
      this.drop.close();
    }
    // this.drop.toggle();
  }

  constructor() {}

  ngOnInit() {}

  getNameAt(index: number): string {
    if (index >= 0) {
      if (this.names && index < this.names.length) {
        return this.names[index];
      }
    }
    return '';
  }

  getHelpAt(index: number): string {
    if (index >= 0) {
      if (this.helps && index < this.helps.length) {
        return this.helps[index];
      }
    }
    return '';
  }
}
