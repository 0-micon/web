import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

const DB_NAME = 'test-library-v-002';
const DB_VERSION = 1;

type StoreName = 'books' | 'cards';

const BOOK_STORE_NAME: StoreName = 'books';
const BOOK_ID = 'isbn';

const CARD_STORE_NAME: StoreName = 'cards';
const CARD_ID = 'pkey';

export interface Book {
  name: string; // Book's name
  info?: string; // Any additional info
  isbn?: string; // Book's id
  date?: string; // Creation date in YYYY-MM-DD format
}

export interface Card {
  isbn: string; // Book's id
  name: string;
  data: string[];
}

function toPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error.message);
  });
}

// function toControlledPromise<T, K>(
//   request: IDBRequest<T>,
//   controller: (result: T, resolve: (value?: K | PromiseLike<K>) => void) => void
// ) {
//   return new Promise<K>((resolve, reject) => {
//     request.onsuccess = () => controller(request.result, resolve);
//     request.onerror = () => reject(request.error.message);
//   });
// }

export type Resolver<T> = (key: T) => void;
export type Rejector = (reason: string) => void;

// Returns current date in YYYY-MM-DD format.
function getDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  return '' + y + (m < 10 ? '-0' : '-') + m + (d < 10 ? '-0' : '-') + d;
}

@Injectable({
  providedIn: 'root'
})
export class DictionaryDbService {
  private _openPromise: Promise<void>; // Note: .then() may be called many times on the same promise.

  // Our connection to the database.
  private _db: IDBDatabase;
  openError: string;

  get isOpen(): boolean {
    return !!this._db;
  }

  constructor(private _ngZone: NgZone) {
    this._openPromise = new Promise<void>((resolve, reject) => {
      const request: IDBOpenDBRequest = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = event => {
        this.onOpenError(request);
        reject(request.error.message);
      };
      request.onupgradeneeded = event => this.onUpgradeNeeded(request);
      request.onsuccess = event => {
        this.onOpenSuccess(request);
        resolve();
      };
    });
    // const request: IDBOpenDBRequest = window.indexedDB.open(DB_NAME, DB_VERSION);
    // request.onerror = event => this.onOpenError(request, event);
    // request.onupgradeneeded = event => this.onUpgradeNeeded(request, event);
    // request.onsuccess = event => this.onOpenSuccess(request, event);
  }

  // // NOTE: DB should be already opened.
  // private _getStoreAsPromise(name: string, mode?: IDBTransactionMode): Promise<IDBObjectStore> {
  //   return new Promise<IDBObjectStore>((resolve, reject) => {
  //     if (this._db.objectStoreNames.contains(name)) {
  //       const transaction: IDBTransaction = this._db.transaction([name], mode);
  //       resolve(transaction.objectStore(name));
  //     } else {
  //       reject(`DB error: objectStore '${name}' does not exists.`);
  //     }
  //   });
  // }

  // Save get store promise.
  private _getStore(name: StoreName, mode?: IDBTransactionMode): Promise<IDBObjectStore> {
    return this._openPromise.then(() => this._db.transaction([name], mode).objectStore(name));
  }

  getAllBooks(): Promise<Book[]> {
    return this._getStore(BOOK_STORE_NAME, 'readonly').then(store => toPromise(store.getAll()));
  }

  getCardCount(isbn: string): Promise<number> {
    return this._getStore(CARD_STORE_NAME, 'readonly').then(store =>
      toPromise(store.index('isbn').count(isbn))
    );
  }

  private _deleteCards(
    isbn: string,
    count: number,
    onprogress: (percent: number) => void
  ): Promise<void> {
    return this._getStore(CARD_STORE_NAME, 'readwrite').then(store =>
      this._runStoreOutsideAngular(store, () => {
        let done = 0;
        let percent = 0;
        const request = store.index('isbn').openCursor(isbn);
        request.onsuccess = () => {
          NgZone.assertNotInAngularZone();
          const cursor = request.result;
          if (cursor && done < count) {
            cursor.delete();
            cursor.continue();

            done++;
            const p = Math.floor((100 * done) / count);
            if (p !== percent) {
              percent = p;
              this._ngZone.run(onprogress, undefined, [percent]);
            }
          }
        };
      })
    );
  }

  private _clearCards(isbn: string): Promise<void> {
    return this._getStore(CARD_STORE_NAME, 'readwrite').then(store =>
      this._runStoreOutsideAngular(store, () => {
        const request = store.index('isbn').openCursor(isbn);
        request.onsuccess = () => {
          NgZone.assertNotInAngularZone();
          const cursor = request.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        };
      })
    );
  }

  // private _runStoreOutsideAngular<T>(
  //   store: IDBObjectStore,
  //   fn: () => T,
  //   oncomplete: () => void,
  //   onerror: () => void
  // ): T {
  //   store.transaction.oncomplete = () => this._ngZone.run(oncomplete);
  //   store.transaction.onerror = () => this._ngZone.run(onerror);
  //   return this._ngZone.run(fn);
  // }

  private _runStoreOutsideAngular(store: IDBObjectStore, task: () => void): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      store.transaction.oncomplete = () => this._ngZone.run(resolve);
      store.transaction.onerror = () => this._ngZone.run(() => reject(store.transaction.error));
      this._ngZone.runOutsideAngular(task);
    });
  }

  // private _toRunOutsideAngularPromise<T>(
  //   store: IDBObjectStore,
  //   request: IDBRequest<T>,
  //   onsuccess: Resolver<T>
  // ): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     store.transaction.oncomplete = () => this._ngZone.run(resolve);
  //     store.transaction.onerror = () => this._ngZone.run(() => reject(store.transaction.error));

  //     request.onsuccess = () => this._ngZone.runOutsideAngular(() => onsuccess(request.result));
  //   });
  // }

  deleteCards(isbn: string, onprogress?: (percent: number) => void): Promise<void> {
    if (onprogress) {
      return this.getCardCount(isbn).then(count => this._deleteCards(isbn, count, onprogress));
    } else {
      return this._clearCards(isbn);
    }
  }

  deleteBook(isbn: string, onprogress?: (percent: number) => void): Promise<void> {
    return this.deleteCards(isbn, onprogress)
      .then(() => this._getStore(BOOK_STORE_NAME, 'readwrite'))
      .then(store => toPromise(store.delete(isbn)));
  }

  addBook(
    name: string,
    data: string[][],
    info?: string,
    onprogress?: (percent: number) => void
  ): Promise<string> {
    const book: Book = { name, info, date: getDate() };
    return this._getStore(BOOK_STORE_NAME, 'readwrite')
      .then(store => toPromise(store.add(book)))
      .then(isbn => this._addCards(isbn as string, data, onprogress));
  }

  private _addCards(
    isbn: string,
    data: string[][],
    onprogress?: (percent: number) => void
  ): Promise<string> {
    return this._getStore(CARD_STORE_NAME, 'readwrite')
      .then(store => {
        let percent = 0;
        let index = 0;
        const next = () => {
          NgZone.assertNotInAngularZone();
          if (index < data.length) {
            const item: Card = {
              isbn,
              name: data[index][0].toLowerCase(),
              data: data[index] // .slice(1)
            };

            index++;
            if (onprogress) {
              const p = Math.floor((100 * index) / data.length);
              if (p !== percent) {
                percent = p;
                this._ngZone.run(onprogress, undefined, [p]);
              }
            }

            store.add(item).onsuccess = next;
          }
        };
        return this._runStoreOutsideAngular(store, next);
      })
      .then(() => Promise.resolve(isbn));
  }

  getCards(query?: IDBValidKey | IDBKeyRange, count?: number): Promise<Card[]> {
    return this._getStore(CARD_STORE_NAME, 'readonly').then(store =>
      toPromise<Card[]>(store.index('name').getAll(query, count))
    );
  }

  getCardRange(query: string, count?: number): Promise<Card[]> {
    query = query.toLowerCase();
    const range = IDBKeyRange.lowerBound(query); // All keys ≥ query
    return this.getCards(range, count);
  }

  // Handles the event whereby a new version of the database needs to be created.
  // Either one has not been created before, or a new version number has been submitted
  // via the window.indexedDB.open.
  onUpgradeNeeded(request: IDBOpenDBRequest) {
    this._db = request.result;

    // Create an objectStore for this database.
    // Records within an object store are sorted according to their keys.
    // This sorting enables fast insertion, look-up, and ordered retrieval.
    const bookStore: IDBObjectStore = this._db.createObjectStore(BOOK_STORE_NAME, {
      keyPath: BOOK_ID,
      autoIncrement: true
    });

    // define what data items the objectStore will contain
    bookStore.createIndex('name', 'name', { unique: false });
    bookStore.createIndex('date', 'date', { unique: false });

    const cardStore: IDBObjectStore = this._db.createObjectStore(CARD_STORE_NAME, {
      keyPath: CARD_ID,
      autoIncrement: true
    });

    // define what data items the objectStore will contain
    cardStore.createIndex('name', 'name', { unique: false });
    cardStore.createIndex('isbn', 'isbn', { unique: false });
  }

  onOpenSuccess(request: IDBOpenDBRequest) {
    this._db = request.result;
    console.log('DB open success:', request.result.name);
  }

  onOpenError(request: IDBOpenDBRequest) {
    this.openError = 'DB open error: ' + request.error.message;
    console.error('DB Error:', request.error);
  }
}
