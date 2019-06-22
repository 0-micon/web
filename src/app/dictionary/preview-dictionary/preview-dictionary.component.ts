import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DropdownDirective } from 'src/app/shared/ngb-extension/dropdown/dropdown.directive';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

type Card = string[];

function compare(a: Card, b: Card): number {
  return a[0].toLocaleLowerCase().localeCompare(b[0].toLocaleLowerCase());
}

function getTags(word: string): string[] {
  const set = new Set<string>();
  const l = word.length;
  const minL = 3;
  for (let i = 0; i <= l - minL; i++) {
    const a = word[i];
    if (a === ' ') {
      continue;
    }

    for (let j = i + 1; j <= l - minL + 1; j++) {
      const b = word[j];
      if (b === ' ') {
        continue;
      }

      for (let k = j + 1; k <= l - minL + 2; k++) {
        const c = word[k];
        if (c !== ' ') {
          const sub = a + b + c;
          set.add(sub);
        }
      }
    }
  }
  return Array.from(set.values());
}

function addTags(word: string, accum: Map<string, Set<string>>) {
  const l = word.length;
  const minL = 3;
  for (let i = 0; i <= l - minL; i++) {
    const a = word[i];
    if (a === ' ') {
      continue;
    }

    for (let j = i + 1; j <= l - minL + 1; j++) {
      const b = word[j];
      if (b === ' ') {
        continue;
      }

      for (let k = j + 1; k <= l - minL + 2; k++) {
        const c = word[k];
        if (c !== ' ') {
          const sub = a + b + c;
          if (accum.has(sub)) {
            accum.get(sub).add(word);
          } else {
            const set = new Set<string>();
            set.add(word);
            accum.set(sub, set);
          }
        }
      }
    }
  }
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

  map = new Map<string, Set<string>>();
  tags: string[] = [];
  data: string[] = [];

  model: string;

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

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => (term.length < 3 ? [] : this._searchFor(term)))
      // tslint:disable-next-line: semicolon
    );

  reset() {
    this.cardHeader = this.cardBody = '';
    this.currentGroup = this.currentIndex = -1;
    this.itemCount = 0;

    this.letters = [];
    this.buckets = [];
    this.words = [];

    this.map = new Map<string, Set<string>>();
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

      // Generate tags.
      if (word.length > 3) {
        addTags(word.toLowerCase(), this.map);
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

    this.tags = Array.from(this.map.keys());
    this.tags.sort((a, b) => this.map.get(b).size - this.map.get(a).size);
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

    // if (this.cardHeader) {
    // const word = this.cardHeader.toLowerCase();
    // if (word.length >= 3) {
    //   addTags(word, this.map);
    //   this.tags = Array.from(this.map.keys());
    //   this.tags.sort();
    // }
    // const l = word.length;
    // const minL = 3;
    // const set: { [key: string]: boolean } = {};
    // for (let i = 0; i <= l - minL; i++) {
    //   for (let j = i + 1; j <= l - minL + 1; j++) {
    //     for (let k = j + 1; k <= l - minL + 2; k++) {
    //       const sub = word[i] + word[j] + word[k];
    //       set[sub] = true;
    //     }
    //   }
    // }
    // const arr = Object.keys(set);
    // arr.sort();
    // console.log(word, l);
    // console.log('Substring array:', arr);
    // const arr: string[] = [];
    // const map = new Map<string, number>();
    // // Substring it.
    // for (let k = l - 1; k >= minL; k--) {
    //   for (let i = 0; i <= l - k; i++) {
    //     const sub = word.substring(i, i + k);
    //     if (!map.has(sub)) {
    //       map.set(sub, i);
    //     }
    //   }
    // }
    // console.log('Substring array:', Array.from(map.keys()));
    // }
  }

  _searchFor(term: string): string[] {
    term = term.toLowerCase();
    const tags = getTags(term);
    if (tags) {
      // All tags should have word sets.
      for (const t of tags) {
        if (!this.map.has(t)) {
          return [];
        }
      }
      const list = Array.from(this.map.get(tags[0]));
      for (let i = tags.length; i-- > 1; ) {
        const set = this.map.get(tags[i]);
        for (let j = list.length; j-- > 0; ) {
          if (!set.has(list[j])) {
            list.splice(j, 1);
          }
        }
      }
      list.sort((a, b) => {
        const i = a.indexOf(term);
        const j = b.indexOf(term);
        if (i >= 0) {
          if (j >= 0) {
            if (i !== j) {
              return i - j;
            }
          } else {
            return -1;
          }
        } else {
          if (j >= 0) {
            return 1;
          }
        }
        return a.localeCompare(b);
      });
      return list.slice(0, 10);
    }
    return [];
  }

  selectTag(selection: number) {
    const w = this.tags[selection];
    const set = this.map.get(w);
    this.data = Array.from(set.values());
    this.data.sort((a, b) => {
      const i = a.indexOf(w);
      const j = b.indexOf(w);
      if (i >= 0) {
        if (j >= 0) {
          if (i !== j) {
            return i - j;
          }
        } else {
          return -1;
        }
      } else {
        if (j >= 0) {
          return 1;
        }
      }
      return a.localeCompare(b);
    });
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

  generateTags() {}
}
