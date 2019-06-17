import { Injectable, NgZone } from '@angular/core';

const DB_NAME = 'test-library-v-001';
const DB_VERSION = 1;
const BOOK_STORE_NAME = 'books';
const BOOK_ID = 'isbn';

const CARD_STORE_NAME = 'cards';
const CARD_ID = 'pkey';

interface IBook {
  name: string; // Book's name
  info?: string; // Any additional info
  isbn?: string; // Book's id
  date?: string; // Creation date in YYYY-MM-DD format
}

interface ICard {
  isbn: string; // Book's id
  name: string;
  data: string[];
}

// Returns current date in YYYY-MM-DD format.
function getDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  return '' + y + (m < 10 ? '-0' : '-') + m + (d < 10 ? '-0' : '-') + d;
}

export type Resolver = (key: IDBValidKey) => void;
export type Rejector = (reason: string) => void;

@Injectable({
  providedIn: 'root'
})
export class DictionaryDbService {
  // Our connection to the database.
  private _db: IDBDatabase;
  openError: string;

  get isOpen(): boolean {
    return !!this._db;
  }

  constructor(private _ngZone: NgZone) {
    const request: IDBOpenDBRequest = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = event => this.onOpenError(request, event);
    request.onupgradeneeded = event => this.onUpgradeNeeded(request, event);
    request.onsuccess = event => this.onOpenSuccess(request, event);
  }

  // Handles the event whereby a new version of the database needs to be created.
  // Either one has not been created before, or a new version number has been submitted
  // via the window.indexedDB.open.
  onUpgradeNeeded(request: IDBOpenDBRequest, event: IDBVersionChangeEvent) {
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

  onOpenSuccess(request: IDBOpenDBRequest, event: Event) {
    this._db = request.result;
    console.log('DB open success:', request.result.name);
  }

  onOpenError(request: IDBOpenDBRequest, event: Event) {
    this.openError = 'Database opening error: ' + request.error.message;
    console.error('DB Error:', request.error);
  }

  // CRUD operations:
  create(storeName: string, value: any, key?: IDBValidKey): Promise<IDBValidKey> {
    return new Promise<IDBValidKey>((resolve, reject) => {
      if (this.isOpen) {
        if (this._db.objectStoreNames.contains(storeName)) {
          const transaction: IDBTransaction = this._db.transaction([storeName], 'readwrite');
          const request: IDBRequest<IDBValidKey> = transaction
            .objectStore(storeName)
            .add(value, key);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () =>
            reject('There has been an error while adding the data: ' + request.error);
        } else {
          reject('objectStore does not exists: ' + storeName);
        }
      } else {
        reject('Database is not open!');
      }
    });
  }

  onError(reason: string, reject?: Rejector) {
    if (reject) {
      reject(reason);
    } else {
      console.log('DB error:', reason);
    }
  }

  onSuccess(key: IDBValidKey, resolve?: Resolver) {
    if (resolve) {
      resolve(key);
    } else {
      console.log('DB success:', key);
    }
  }

  getStore(name: string, mode?: IDBTransactionMode, reject?: Rejector): IDBObjectStore | null {
    if (this.isOpen) {
      if (this._db.objectStoreNames.contains(name)) {
        const transaction: IDBTransaction = this._db.transaction([name], mode);
        return transaction.objectStore(name);
      } else {
        this.onError('objectStore does not exists: ' + name, reject);
      }
    } else {
      this.onError('Database is not open!', reject);
    }
    return null;
  }

  add(storeName: string, value: any, key?: IDBValidKey, resolve?: Resolver, reject?: Rejector) {
    const store: IDBObjectStore = this.getStore(storeName, 'readwrite', reject);
    if (store) {
      const request: IDBRequest<IDBValidKey> = store.add(value, key);
      request.onsuccess = () => this.onSuccess(request.result, resolve);
      request.onerror = () =>
        this.onError('There has been an error while adding the data: ' + request.error, reject);
    }
  }

  addBook(name: string, info?: string, resolve?: Resolver, reject?: Rejector) {
    const book: IBook = { name, info, date: getDate() };
    this.add(BOOK_STORE_NAME, book, undefined, resolve, reject);
  }

  addCard(isbn: string, name: string, data: string[], resolve?: Resolver, reject?: Rejector) {
    const item: ICard = {
      isbn,
      name,
      data
    };
    return this.add(CARD_STORE_NAME, item, undefined, resolve, reject);
  }

  addCards(
    isbn: string,
    data: string[][],
    progress?: (percent: number) => void,
    reject?: Rejector
  ) {
    const store: IDBObjectStore = this.getStore(CARD_STORE_NAME, 'readwrite', reject);
    if (store && data) {
      let percent = 0;
      let index = -1;

      const onerror = (request: IDBRequest) => {
        this.onError('There has been an error while adding the data: ' + request.error, reject);
      };

      const next = () => {
        NgZone.assertNotInAngularZone();
        index++;
        const p = Math.floor((100 * index) / data.length);
        if (p !== percent) {
          percent = p;
          // progress(p);
          this._ngZone.run(progress, undefined, [p]);
        }
        if (index < data.length) {
          const item: ICard = {
            isbn,
            name: data[index][0],
            data: data[index].slice(1)
          };
          const request: IDBRequest<IDBValidKey> = store.add(item);
          request.onsuccess = next;
          request.onerror = () => onerror(request);
        }
      };
      // next();
      this._ngZone.runOutsideAngular(next);
    }
  }

  addAll(data: string[]): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const transaction: IDBTransaction = this._db.transaction([CARD_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(CARD_STORE_NAME);

      const next = (index: number) => {
        const request = store.add(data[index]);
        if (index + 1 < data.length) {
          request.onsuccess = () => next(index + 1);
        } else {
          request.onsuccess = () => resolve(data.length);
        }
        request.onerror = () =>
          reject('There has been an error while adding the data: ' + request.error);
      };

      next(0);
    });
  }

  // addCards(
  //   bookId: string,
  //   cards: string[][],
  //   cardIndex: number = 0,
  //   callback?: () => Promise<IDBValidKey>
  // ): Promise<IDBValidKey> {
  //   if (cardIndex < cards.length) {
  //     return this.addCards
  //   }
  // }
}
