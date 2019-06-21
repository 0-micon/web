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

  loading = false;
  showAddDictionary: false;

  deleteItem: Book;
  deleteProgress = 0;

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
      .deleteBook(book.isbn, percent => (this.deleteProgress = percent))
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
