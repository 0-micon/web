import { Component, OnInit } from '@angular/core';
import { DictionaryDbService, Book, wordToTags } from '../services/dictionary-db.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.scss']
})
export class BookshelfComponent implements OnInit {
  items: Book[] = [];
  errorMessage: string;

  loading = false;
  showAddDictionary: false;

  deleteItem: Book;
  deleteProgress = 0;

  model = '';

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => (term.length < 3 ? [] : this._searchFor(term)))
      // tslint:disable-next-line: semicolon
    );

  _searchFor(term: string): string[] {
    this._db.getTags(term);
    return [];
    // term = term.toLowerCase();
    // const tags = wordToTags(term);
    // if (tags) {
    //   // All tags should have word sets.
    //   for (const t of tags) {
    //     if (!this.map.has(t)) {
    //       return [];
    //     }
    //   }
    //   const list = Array.from(this.map.get(tags[0]));
    //   for (let i = tags.length; i-- > 1; ) {
    //     const set = this.map.get(tags[i]);
    //     for (let j = list.length; j-- > 0; ) {
    //       if (!set.has(list[j])) {
    //         list.splice(j, 1);
    //       }
    //     }
    //   }
    //   list.sort((a, b) => {
    //     const i = a.indexOf(term);
    //     const j = b.indexOf(term);
    //     if (i >= 0) {
    //       if (j >= 0) {
    //         if (i !== j) {
    //           return i - j;
    //         }
    //       } else {
    //         return -1;
    //       }
    //     } else {
    //       if (j >= 0) {
    //         return 1;
    //       }
    //     }
    //     return a.localeCompare(b);
    //   });
    //   return list.slice(0, 10);
    // }
    // return [];
  }

  constructor(private _db: DictionaryDbService) {}

  getBooks() {
    this.loading = true;
    this.deleteItem = null;
    this._db
      .getAllBooks()
      .then(books => (this.items = books))
      .catch(error => (this.errorMessage = error))
      .finally(() => (this.loading = false));
  }

  ngOnInit() {
    // this._db.getBooksObservable().subscribe(books => (this.items = books));
    this.getBooks();
  }

  deleteBook(book: Book) {
    this.loading = true;
    this.deleteItem = book;
    this.deleteProgress = 0;
    this._db
      .deleteBook(book.id, percent => (this.deleteProgress = percent))
      .then(() => this.getBooks())
      .finally(() => (this.loading = false));
  }

  // private _getBooks() {
  //   if (this._db.isOpen) {
  //     this._db.getBooks(books => {
  //       console.log('Book Keys:', books);
  //       this.items = books;
  //     });
  //   } else {
  //     if (this._db.openError) {
  //       this.errorMessage = this._db.openError;
  //     } else {
  //       // Try again.
  //       setTimeout(() => {
  //         this._getBooks();
  //       }, 100);
  //     }
  //   }
  // }
}
