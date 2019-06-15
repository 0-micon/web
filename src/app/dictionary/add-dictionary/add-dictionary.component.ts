import { Component, OnInit } from '@angular/core';

type Card = string[];

class Dict {
  alphabeticalIndex = new Map<string, Card[]>();

  constructor(words: Card[]) {
    // Split by first letter.
    words.forEach(card => {
      const word = card[0];
      const key = word.substr(0, 1).toLowerCase();
      if (this.alphabeticalIndex.has(key)) {
        this.alphabeticalIndex.get(key).push(card);
      } else {
        this.alphabeticalIndex.set(key, [card]);
      }
    });
  }
}

@Component({
  selector: 'app-add-dictionary',
  templateUrl: './add-dictionary.component.html',
  styleUrls: ['./add-dictionary.component.scss']
})
export class AddDictionaryComponent implements OnInit {
  words: string[][] = [];
  activeTab = 0;

  constructor() {}

  ngOnInit() {}

  onUpload(data: string[][]) {
    this.words = data;
    if (data) {
      this.activeTab = 1;
    }
  }

  onUploadError(message: string) {
    console.warn(message);
  }
}
