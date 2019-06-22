import { Component, OnInit } from '@angular/core';
import { DictionaryDbService } from '../services/dictionary-db.service';

@Component({
  selector: 'app-dictionary-search',
  templateUrl: './dictionary-search.component.html',
  styleUrls: ['./dictionary-search.component.scss']
})
export class DictionarySearchComponent implements OnInit {
  constructor(private _db: DictionaryDbService) {}

  ngOnInit() {}

  onChange(word: string) {
    if (word) {
      console.log('onChange:', word);
      this._db.getCardRange(word, 10).then(cards => console.log('Cards:', cards));
    }
  }
}
