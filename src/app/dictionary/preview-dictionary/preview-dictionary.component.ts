import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DropdownDirective } from 'src/app/shared/ngb-extension/dropdown/dropdown.directive';

type Card = string[];

function compare(a: Card, b: Card): number {
  return a[0].toLocaleLowerCase().localeCompare(b[0].toLocaleLowerCase());
}

@Component({
  selector: 'app-preview-dictionary',
  templateUrl: './preview-dictionary.component.html',
  styleUrls: ['./preview-dictionary.component.scss']
})
export class PreviewDictionaryComponent implements OnInit {
  cardHeader: string;
  cardBody: string;

  letters: string[];
  buckets: Card[][];
  words: string[][];

  currentGroup: number;
  currentIndex: number;
  itemCount: number;

  @Input() set items(items: Card[]) {
    this.reset();
    if (items) {
      this.apply(items);
    }
  }

  @Input() name: string;

  get canSelectPrev() {
    return this.currentGroup > 0 || (this.currentGroup === 0 && this.currentIndex > 0);
  }

  get canSelectNext() {
    const lastBucket = this.buckets ? this.buckets.length - 1 : -1;
    return (
      lastBucket >= 0 &&
      (this.currentGroup < lastBucket ||
        (this.currentGroup === lastBucket &&
          this.currentIndex < this.buckets[lastBucket].length - 1))
    );
  }

  @ViewChild('drop') drop: DropdownDirective;

  reset() {
    this.cardHeader = this.cardBody = '';
    this.currentGroup = this.currentIndex = -1;
    this.itemCount = 0;

    this.letters = [];
    this.buckets = [];
    this.words = [];
  }

  apply(items: Card[]) {
    this.itemCount = items.length;

    // Split by first letter.
    const alphabeticalIndex: { [key: string]: Card[] } = {};
    items.forEach(card => {
      const word = card[0];
      const key = word.substr(0, 1).toLowerCase();
      if (alphabeticalIndex[key]) {
        alphabeticalIndex[key].push(card);
      } else {
        alphabeticalIndex[key] = [card];
      }
    });

    this.letters = Object.keys(alphabeticalIndex);
    this.letters.sort();

    // Fill buckets.
    for (const key of this.letters) {
      const bucket: Card[] = alphabeticalIndex[key];
      bucket.sort(compare);
      this.buckets.push(bucket);

      const words: string[] = [];
      for (const card of bucket) {
        words.push(card[0]);
      }
      this.words.push(words);

      if (this.buckets) {
        this.onSelectionChange(0, 0);
      }
    }
  }

  constructor() {
    this.reset();
  }

  ngOnInit() {}

  onSelectionChange(group: number, index: number) {
    const card = this.buckets[group][index];
    this.cardHeader = card[0];
    this.cardBody = card.slice(1).join('\n');
    this.currentGroup = group;
    this.currentIndex = index;

    if (this.drop) {
      this.drop.opened = false;
    }
  }

  selectPrev() {
    if (this.canSelectPrev) {
      if (this.currentIndex > 0) {
        this.onSelectionChange(this.currentGroup, this.currentIndex - 1);
      } else {
        this.onSelectionChange(
          this.currentGroup - 1,
          this.buckets[this.currentGroup - 1].length - 1
        );
      }
    }
  }

  selectNext() {
    if (this.canSelectNext) {
      if (this.currentIndex >= this.buckets[this.currentGroup].length - 1) {
        this.onSelectionChange(this.currentGroup + 1, 0);
      } else {
        this.onSelectionChange(this.currentGroup, this.currentIndex + 1);
      }
    }
  }
}
