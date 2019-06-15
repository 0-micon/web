import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

type Card = string[];

function compare(a: Card, b: Card): number {
  return a[0].toLocaleLowerCase().localeCompare(b[0].toLocaleLowerCase());
}

@Component({
  selector: 'app-preview-dictionary',
  templateUrl: './preview-dictionary.component.html',
  styleUrls: ['./preview-dictionary.component.scss']
})
export class PreviewDictionaryComponent implements OnInit, OnChanges {
  @Input() items: Card[] = [];

  letters: string[] = [];
  buckets: Card[][] = [];
  words: string[][] = [];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      // Split by first letter.
      const alphabeticalIndex: { [key: string]: Card[] } = {};
      this.items.forEach(card => {
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
      this.buckets = [];
      this.words = [];
      for (const key of this.letters) {
        const bucket: Card[] = alphabeticalIndex[key];
        bucket.sort(compare);
        this.buckets.push(bucket);

        const words: string[] = [];
        for (const card of bucket) {
          words.push(card[0]);
        }
        this.words.push(words);
      }
    }
  }
}
