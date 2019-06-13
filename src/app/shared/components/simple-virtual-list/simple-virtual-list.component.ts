// tslint:disable: no-inferrable-types

import {
  Component,
  OnInit,
  OnChanges,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  SimpleChange
} from '@angular/core';

@Component({
  selector: 'app-simple-virtual-list',
  templateUrl: './simple-virtual-list.component.html',
  styleUrls: ['./simple-virtual-list.component.scss']
})
export class SimpleVirtualListComponent implements OnInit, OnChanges {
  // pointerEvents: 'none' | 'auto' = 'auto';

  // TODO: rename bufferCount into bufferSize.
  get bufferCount() {
    return this.rows + this.bufferSize;
  }

  get firstItem() {
    return this._firstItem;
  }

  set firstItem(value: number) {
    const firstItemMax = this.items.length - this.bufferCount;
    const newValue = Math.min(firstItemMax, Math.max(0, value));
    if (newValue !== this._firstItem) {
      this._firstItem = newValue;
      // this.pointerEvents = 'none';
      // setTimeout(()=>{
      //   this.pointerEvents = 'auto';
      // }, 1000);
    }
  }

  get scrollTop() {
    return this.view.nativeElement.scrollTop;
  }

  set scrollTop(value: number) {
    this.view.nativeElement.scrollTop = value;
  }

  // Scroll to the offset for the given index.
  // index: The index of the element to scroll to.
  // scrollToIndex(index: number) {
  //   const item = Math.min(this.items.length - this.rows, Math.max(0, index));
  //   this.scrollTop = item * this.lineHeight;
  // }

  constructor() {}

  @ViewChild('view') view: ElementRef<HTMLElement>;
  // The virtually scrolling list items.
  @Input() items: string[] = [];
  @Input() itemTitles: string[]; // Optional.
  @Input() itemNames: string[]; // Optional.

  // The number of rows in the view of the virtually scrolling list.
  @Input() rowMax: number = 5;

  rows = 0;

  // The size of the line in the virtually scrolling list.
  @Input() lineHeight: number = 32;
  // The number of additionally buffered lines.
  @Input() bufferSizeMax: number = 10; // TODO: rename bufferSizeMax into paddingSizeMax or something.
  // TODO: rename bufferSize into paddingSize or something.
  bufferSize = 0;

  @Input() selection: number = -1;

  @Output() selectionChange = new EventEmitter<number>();

  focusedItem = -1;
  hasFocus = false;

  private _firstItem = 0;

  toIndex(offset: number) {
    return this._firstItem + offset;
  }

  bufferIsSelection(offset: number): boolean {
    return this.selection === this.toIndex(offset);
  }

  bufferIsFocus(offset: number): boolean {
    return this.hasFocus && this.focusedItem === this.toIndex(offset);
  }

  bufferGetItem(offset: number): string {
    const index = this.toIndex(offset);
    if (this.items && index >= 0 && index < this.items.length) {
      return this.items[index];
    }
  }

  bufferGetTitle(offset: number): string {
    const index = this.toIndex(offset);
    if (this.itemTitles && index >= 0 && index < this.itemTitles.length) {
      return this.itemTitles[index];
    }
  }

  bufferOnClick(offset: number) {
    const index = this.toIndex(offset);
    this.focusedItem = index;
    this.selectionChange.emit(index);
  }

  setFocus() {
    if (this.view && this.view.nativeElement) {
      this.view.nativeElement.focus();
    }
  }

  scrollToItem(index: number) {
    if (index >= 0 && index < this.items.length) {
      const scrollTop = this.scrollTop;
      const y = index * this.lineHeight;

      if (y < scrollTop) {
        this.scrollTop = y;
      } else {
        const deltaY = (this.rows - 1) * this.lineHeight;
        if (y > scrollTop + deltaY) {
          this.scrollTop = y - deltaY;
        }
      }
    }
  }

  onScroll(event) {
    // const scrollTop = event.target.scrollTop;
    const scrollTop = this.scrollTop;
    const nextItem = Math.floor(scrollTop / this.lineHeight);

    const deltaOffset = nextItem - this.firstItem;
    if (deltaOffset < 0) {
      this.firstItem = nextItem - this.bufferSize + 1;
    } else if (deltaOffset >= this.bufferSize) {
      this.firstItem = nextItem - 1;
    }
  }

  onKeyDown(event: KeyboardEvent) {
    const itemMax = this.items.length - 1;
    switch (event.code) {
      case 'Home':
        this.focusedItem = 0;
        break;
      case 'End':
        this.focusedItem = itemMax;
        break;
      case 'Down':
      case 'ArrowDown':
        this.focusedItem = Math.min(itemMax, this.focusedItem + 1);
        event.preventDefault();
        this.scrollToItem(this.focusedItem);
        break;
      case 'Up':
      case 'ArrowUp':
        this.focusedItem = Math.max(0, this.focusedItem - 1);
        event.preventDefault();
        this.scrollToItem(this.focusedItem);
        break;
      case 'PageUp':
        this.focusedItem = Math.max(0, this.focusedItem - this.rows);
        event.preventDefault();
        this.scrollToItem(this.focusedItem);
        break;
      case 'PageDown':
        this.focusedItem = Math.min(itemMax, this.focusedItem + this.rows);
        event.preventDefault();
        this.scrollToItem(this.focusedItem);
        break;
      case 'Space':
      case 'Enter':
        event.preventDefault();
        if (this.focusedItem >= 0 && this.focusedItem <= itemMax) {
          this.bufferOnClick(this.focusedItem - this._firstItem);
        }
    }
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const selectionChange: SimpleChange = changes.selection;
    if (selectionChange) {
      this.focusedItem = selectionChange.currentValue;
    }

    const count = this.items.length;

    this.rows = Math.min(count, this.rowMax);
    this.bufferSize = Math.min(count - this.rows, this.bufferSizeMax);

    // Adjust firstItem and scrollTop position.
    const scrollTopMax = Math.max(0, count - this.rows) * this.lineHeight;
    if (this.scrollTop > scrollTopMax) {
      this.firstItem = this._firstItem;
      this.scrollTop = scrollTopMax;
    }
  }
}
