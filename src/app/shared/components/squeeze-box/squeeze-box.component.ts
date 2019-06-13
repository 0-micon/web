import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-squeeze-box',
  templateUrl: './squeeze-box.component.html',
  styleUrls: ['./squeeze-box.component.scss']
})
export class SqueezeBoxComponent implements OnInit, OnChanges {
  @Input() items: string[] = [];
  @Input() itemCountMax = 256;
  @Input() groupCount = 10;
  @Input() expanded = false;

  groups: string[][];

  private _splitItemsIntoGroups() {
    this.groups = [];
    const length = this.items.length;
    const count = Math.ceil(length / this.groupCount);
    for (let i = 0; i < length; i += count) {
      this.groups.push(this.items.slice(i, i + count));
    }
  }

  get iconName(): string {
    return !this.groups
      ? this.expanded
        ? 'list_alt'
        : 'list'
      : this.expanded
      ? 'keyboard_arrow_down'
      : 'keyboard_arrow_right';
  }

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items || changes.itemCountMax || changes.groupCount) {
      if (this.items.length > this.itemCountMax) {
        this._splitItemsIntoGroups();
      } else {
        this.groups = null;
      }
    }
  }
}
