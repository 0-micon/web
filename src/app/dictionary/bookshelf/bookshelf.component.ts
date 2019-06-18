import { Component, OnInit } from '@angular/core';
import { DictionaryDbService, Book } from '../services/dictionary-db.service';

@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.scss']
})
export class BookshelfComponent implements OnInit {
  items: Book[] = [];
  errorMessage: string;

  constructor(private _db: DictionaryDbService) {}

  private _getBooks() {
    this._db
      .getBooksPromise()
      .then(books => (this.items = books))
      .catch(error => (this.errorMessage = error));
  }

  ngOnInit() {
    // this._db.getBooksObservable().subscribe(books => (this.items = books));
    this._getBooks();
  }

  deleteBook(isbn: string) {
    this._db.deleteBook(isbn).then(() => this._getBooks());
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
