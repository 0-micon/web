import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DropdownDirective } from 'src/app/shared/ngb-extension/dropdown/dropdown.directive';
import { DictionaryDbService } from '../services/dictionary-db.service';

@Component({
  selector: 'app-dictionary-search',
  templateUrl: './dictionary-search.component.html',
  styleUrls: ['./dictionary-search.component.scss']
})
export class DictionarySearchComponent implements OnInit {
  @Output() wordChange = new EventEmitter<string>();

  @ViewChild('drop') drop: DropdownDirective;

  private _items: string[] = [];

  get items(): string[] {
    return this._items;
  }

  set items(value: string[]) {
    this._items = value;
    this.drop.opened = !!value;
    this.selection = this.drop.opened ? 0 : -1;
  }

  selection = -1;
  word = '';
  term = '';
  search = new BehaviorSubject<string>('');

  constructor(private _db: DictionaryDbService) {}

  ngOnInit() {
    this.search
      .pipe(
        debounceTime(750),
        distinctUntilChanged(),
        switchMap(term => (term.length < 3 ? Promise.resolve([]) : this._searchFor(term)))
      )
      .subscribe(value => (this.items = value));
  }

  onChange(word: string) {
    this.search.next(word || '');
  }

  onInputEnter() {
    if (this.drop.opened) {
      if (this.selection >= 0 && this.selection < this._items.length) {
        this.word = this._items[this.selection];
        this.wordChange.emit(this.word);
      }
      this.drop.opened = false;
    }
  }

  onItemClick(selection: number) {
    this.selection = selection;
    this.onInputEnter();
  }

  private async _searchFor(term: string) {
    this.term = term.toLowerCase();
    const list: string[] = await this._db.getTags(this.term);
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
    return list;
  }
}
