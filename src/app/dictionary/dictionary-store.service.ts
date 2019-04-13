import { Injectable } from '@angular/core';

interface IBook {
  isbn: string;
  title: string;
  author: string;
  year: string;
}

interface IWord {
  isbn: string;
  word: string;
  info: string;
}

@Injectable({
  providedIn: 'root'
})
export class DictionaryStoreService {
  errorMessage: string;

  private _db: IDBDatabase;

  get isOpen(): boolean {
    return !!this._db;
  }

  // A new version of the database needs to be created
  protected doVersionChange(oldVersion: number, newVersion: number | null): void {
    // Creating an Object Store.
    const books = this._db.createObjectStore('books', { keyPath: 'isbn' });
    books.createIndex('by_title', 'title', { unique: true });
    books.createIndex('by_author', 'author');
    books.createIndex('by_year', 'year');

    const words = this._db.createObjectStore('words', { autoIncrement: true });
    words.createIndex('by_book', 'isbn');
    words.createIndex('by_word', 'word');
  }

  constructor(version: number = 1) {
    // Let us open the database.
    const request: IDBOpenDBRequest = window.indexedDB.open('library', version);
    request.onerror = () => (this.errorMessage = 'Database opening error: ' + request.error);
    request.onsuccess = () => {
      // store the result of opening the database in the db variable.
      this._db = request.result;
      this.errorMessage = null;
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      // store the result of opening the database in the db variable.
      this._db = request.result;
      this.doVersionChange(event.oldVersion, event.newVersion);
    };
  }

  // CRUD operations:
  create(storeName: string, value: any, key?: any): Promise<IDBValidKey> {
    return new Promise<IDBValidKey>((resolve, reject) => {
      if (!this.isOpen) {
        reject('Database is not open!');
      }
      if (!this._db.objectStoreNames.contains(storeName)) {
        reject('objectStore does not exists: ' + storeName);
      }

      const transaction: IDBTransaction = this._db.transaction([], 'readwrite');
      const request: IDBRequest<IDBValidKey> = transaction.objectStore(storeName).add(value, key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        resolve('There has been an error while adding the data: ' + request.error);
    });
  }

  addWord(word: IWord, key?: any): Promise<IDBValidKey> {
    return this.create('words', word, key);
  }

  addBook(book: IBook, key?: any): Promise<IDBValidKey> {
    return this.create('books', book, key);
  }
}
