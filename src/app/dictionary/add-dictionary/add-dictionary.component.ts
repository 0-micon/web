import { Component, OnInit } from '@angular/core';
import { UploadEvent } from '../upload-dictionary-file/upload-dictionary-file.component';

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
  name: string;
  activeTab = 0;

  constructor() {}

  ngOnInit() {}

  onUpload(event: UploadEvent) {
    this.words = event.data;
    this.name = event.name;
    if (event.data) {
      this.activeTab = 1;
    }
  }

  onUploadError(message: string) {
    console.warn(message);
  }
}
