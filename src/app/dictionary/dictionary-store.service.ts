import { Injectable } from '@angular/core';

export interface IBook {
  isbn: string;
  title: string;
  year: string;
  synopsis: string;
}

export interface IWord {
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
    console.log('[DB] Creating book store...');
    const books = this._db.createObjectStore('books', { keyPath: 'isbn' });
    books.createIndex('by_title', 'title');
    books.createIndex('by_year', 'year');
    books.createIndex('by_synopsis', 'synopsis');

    console.log('[DB] Creating word store...');
    const words = this._db.createObjectStore('words', { autoIncrement: true });
    words.createIndex('by_book', 'isbn');
    words.createIndex('by_word', 'word');
  }

  constructor() {
    // Let us open the database.
    const request: IDBOpenDBRequest = window.indexedDB.open('library', 1);
    request.onerror = () => {
      this.errorMessage = 'Database opening error: ' + request.error.message;
      console.error('DB open error:', request.error.message);
    };
    request.onsuccess = () => {
      // store the result of opening the database in the db variable.
      this._db = request.result;
      this.errorMessage = null;
      console.log('DB open success:', request.result.name);
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      console.log('DB upgrade needed:', request.result.name);
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

      const transaction: IDBTransaction = this._db.transaction([storeName], 'readwrite');
      const request: IDBRequest<IDBValidKey> = transaction.objectStore(storeName).add(value, key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject('There has been an error while adding the data: ' + request.error);
    });
  }

  /**
   * Reads the value of the first record matching the given key or key range in query.
   * If successful, request's result will be the value, or undefined if there was no matching record.
   */
  read<T>(storeName: string, querry: IDBValidKey | IDBKeyRange): Promise<T> {
    return new Promise<any>((resolve, reject) => {
      if (!this.isOpen) {
        reject('Database is not open!');
      }
      if (!this._db.objectStoreNames.contains(storeName)) {
        reject('objectStore does not exists: ' + storeName);
      }

      const transaction: IDBTransaction = this._db.transaction([storeName], 'readonly');
      const request: IDBRequest<T> = transaction.objectStore(storeName).get(querry);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject('There has been an error while reading the data: ' + request.error);
    });
  }

  addWord(word: IWord, key?: any): Promise<IDBValidKey> {
    return this.create('words', word, key);
  }

  addBook(book: IBook, key?: any): Promise<IDBValidKey> {
    return this.create('books', book, key);
  }

  getBookByKey(key: string): Promise<IBook> {
    return this.read('books', key);
  }
}
