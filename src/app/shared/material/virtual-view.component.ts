import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { CdkVirtualScrollViewport, ExtendedScrollToOptions } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-virtual-view',
  templateUrl: './virtual-view.component.html',
  styleUrls: ['./virtual-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualViewComponent implements OnInit, OnDestroy {
  @Input()
  items: Iterable<string> = [];
  @Input()
  itemSize: number = 32;
  @Input()
  numberOfRows: number = 10;
  @Input()
  selection: number = -1;
  @Output()
  selectionChange: EventEmitter<number> = new EventEmitter();
  @Input()
  index: number = 0;
  @Output()
  indexChange: EventEmitter<number> = new EventEmitter();

  @ViewChild(CdkVirtualScrollViewport)
  virtualScroll: CdkVirtualScrollViewport;

  constructor() {}

  ngOnInit(): void {
    console.log('VirtualViewComponent: ngOnInit');
  }

  ngOnDestroy(): void {
    console.log('VirtualViewComponent: ngOnDestroy');
  }

  measureScrollOffset(from: 'top' | 'left' | 'right' | 'bottom' | 'start' | 'end'): number {
    return this.virtualScroll ? this.virtualScroll.measureScrollOffset(from) : 0;
  }

  scrollTo(options: ExtendedScrollToOptions): void {
    if (this.virtualScroll) {
      this.virtualScroll.scrollTo(options);
      this.repaint();
    }
  }

  scrolledIndexChange(index: number): void {
    // console.log('[VirtualViewComponent] scrolledIndexChange event:', index);
    // this.index = index;
    // this.indexChange.emit(index);
    // this.virtualScroll.checkViewportSize();
    if (index !== this.index) {
      this.index = index;
      this.indexChange.emit(index);
      this.repaint();
    }
  }

  repaint(): void {
    if (this.virtualScroll) {
      this.virtualScroll.checkViewportSize();
    }
  }

  scrollToIndex(index: number): void {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(index);
    }
    // this.index = index;
    // this.indexChange.emit(index);
    // if (this.virtualScroll) {
    //   // this.virtualScroll.scrollToIndex(index);
    //   this.virtualScroll.checkViewportSize();
    // }
  }
}
