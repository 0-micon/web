import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { MatMenuTrigger } from '@angular/material';

import { VirtualViewComponent } from '../shared/material/virtual-view.component';

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
  selector: 'app-dictionary-input',
  templateUrl: './dictionary-input.component.html',
  styleUrls: ['./dictionary-input.component.scss']
})
export class DictionaryInputComponent implements OnInit, OnChanges {
  @Input() items: string[] = [];
  @Input() numberOfRows = 10;
  @Input() selection = -1;
  @Output() selectionChange = new EventEmitter<number>();
  @Input() inputValue = '';
  @Output() inputValueChange = new EventEmitter<string>();

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild(VirtualViewComponent) virtualView: VirtualViewComponent;

  scrollTopOffset = 0;
  adjustViewOnOpen = false;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Prop Changes:', changes);
    if (changes.items) {
      setTimeout(() => this.select(this.inputValue), 0);
    }
  }

  adjustView() {
    if (this.trigger.menuOpen) {
      if (this.virtualView.index + this.numberOfRows <= this.selection) {
        this.virtualView.scrollToIndex(this.selection + 1 - this.numberOfRows);
      }
      if (this.virtualView.index > this.selection) {
        this.virtualView.scrollToIndex(this.selection);
      }
    } else {
      this.adjustViewOnOpen = true;
    }
  }

  menuOpened() {
    if (this.virtualView) {
      this.virtualView.scrollTo({
        top: this.scrollTopOffset
      });
      if (this.adjustViewOnOpen) {
        this.adjustView();
        this.adjustViewOnOpen = false;
      }
    }
  }

  menuClosed() {
    if (this.virtualView) {
      this.scrollTopOffset = this.virtualView.measureScrollOffset('top');
      this.adjustViewOnOpen = false;
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const minIndex = 0;
    const maxIndex = this.items.length - 1;
    const delta = this.numberOfRows;

    switch (event.key) {
      // Scroll the content by one line at a time.
      case 'ArrowDown':
        if (this.selection < maxIndex) {
          if (this.trigger.menuOpen) {
            if (event.ctrlKey) {
              this.select(maxIndex);
            } else {
              this.select(this.selection + 1);
            }
          }
        }
        break;
      case 'ArrowUp':
        if (this.selection > minIndex) {
          if (this.trigger.menuOpen) {
            if (event.ctrlKey) {
              this.select(minIndex);
            } else {
              this.select(this.selection - 1);
            }
          }
        }
        break;
      // Page by page scrolling.
      case 'PageDown':
        if (this.trigger.menuOpen && this.selection < maxIndex) {
          this.select(Math.min(this.selection + delta, maxIndex));
        }
        break;
      case 'PageUp':
        if (this.trigger.menuOpen && this.selection > minIndex) {
          this.select(Math.max(this.selection - delta, minIndex));
        }
        break;
    }
  }

  onKeyup(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
      case 'Enter':
        if (this.trigger.menuOpen) {
          this.trigger.closeMenu();
        }
        break;
      case 'ArrowDown':
        if (!this.trigger.menuOpen) {
          this.trigger.openMenu();
        }
        break;
    }
  }

  select(value: number | string) {
    let index: number;
    let input: string;
    if (typeof value === 'string') {
      input = value;
      index = lowerBound(this.items, value.toLowerCase());
    } else {
      index = value;
      input = index >= 0 && index < this.items.length ? this.items[index] : '';
    }

    const isSelectionChange = this.selection !== index;
    const isInputChange = this.inputValue !== input;

    if (isSelectionChange) {
      this.selection = index;
    }
    if (isInputChange) {
      this.inputValue = input;
    }
    this.adjustView();

    // Notify
    if (isSelectionChange) {
      this.selectionChange.emit(this.selection);
    }
    if (isInputChange) {
      this.inputValueChange.emit(this.inputValue);
    }
  }
}
