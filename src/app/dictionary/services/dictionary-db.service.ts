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

function toControlledPromise<T, K>(
  request: IDBRequest<T>,
  controller: (result: T, resolve: (value?: K | PromiseLike<K>) => void) => void
) {
  return new Promise<K>((resolve, reject) => {
    request.onsuccess = () => controller(request.result, resolve);
    request.onerror = () => reject(request.error.message);
  });
}

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
  private _isOpen = new BehaviorSubject<boolean>(false);
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

  deleteCards(isbn: string): Promise<void> {
    return this._getStore(CARD_STORE_NAME, 'readwrite').then(
      store =>
        new Promise<void>((resolve, reject) => {
          store.transaction.oncomplete = () => this._ngZone.run(resolve); // resolve();
          store.transaction.onerror = () => this._ngZone.run(() => reject(store.transaction.error));

          const next = () => {
            const index: IDBIndex = store.index('isbn');
            const request: IDBRequest<IDBCursor> = index.openCursor(isbn);
            request.onsuccess = () => {
              NgZone.assertNotInAngularZone();
              const cursor = request.result;
              if (cursor) {
                cursor.delete();
                cursor.continue();
              }
            };
            // request.onerror = () => reject(request.error);
          };
          this._ngZone.runOutsideAngular(next);
        })
    );
  }

  deleteBook(isbn: string): Promise<void> {
    return this.deleteCards(isbn)
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
    return this._getStore(CARD_STORE_NAME, 'readwrite').then(
      store =>
        new Promise<string>((resolve, reject) => {
          let percent = 0;
          let index = -1;

          store.transaction.oncomplete = () => {
            this._ngZone.run(() => {
              if (onprogress) {
                onprogress(100);
              }
              resolve(isbn);
            });
          };
          store.transaction.onerror = () => this._ngZone.run(() => reject(store.transaction.error));

          const next = () => {
            NgZone.assertNotInAngularZone();
            index++;
            if (index < data.length) {
              if (onprogress) {
                const p = Math.floor((100 * index) / data.length);
                if (p !== percent) {
                  percent = p;
                  this._ngZone.run(onprogress, undefined, [p]);
                }
              }

              const item: Card = {
                isbn,
                name: data[index][0],
                data: data[index].slice(1)
              };
              const request: IDBRequest<IDBValidKey> = store.add(item);
              request.onsuccess = next;
              // request.onerror = () => reject(request.error.message);
            }
            //  else {
            //   this._ngZone.run(() => {
            //     if (onprogress) {
            //       this._ngZone.run(onprogress, undefined, [100]);
            //     }
            //   });
            //   resolve(isbn);
            // }
          };
          this._ngZone.runOutsideAngular(next);
        })
    );
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
    this._isOpen.next(true);
    console.log('DB open success:', request.result.name);
  }

  onOpenError(request: IDBOpenDBRequest) {
    this.openError = 'DB open error: ' + request.error.message;
    this._isOpen.error('DB open error: ' + request.error);
    console.error('DB Error:', request.error);
  }

  // CRUD operations:
  // create(storeName: string, value: any, key?: IDBValidKey): Promise<IDBValidKey> {
  //   return new Promise<IDBValidKey>((resolve, reject) => {
  //     if (this.isOpen) {
  //       if (this._db.objectStoreNames.contains(storeName)) {
  //         const transaction: IDBTransaction = this._db.transaction([storeName], 'readwrite');
  //         const request: IDBRequest<IDBValidKey> = transaction
  //           .objectStore(storeName)
  //           .add(value, key);
  //         request.onsuccess = () => resolve(request.result);
  //         request.onerror = () =>
  //           reject('There has been an error while adding the data: ' + request.error);
  //       } else {
  //         reject('objectStore does not exists: ' + storeName);
  //       }
  //     } else {
  //       reject('Database is not open!');
  //     }
  //   });
  // }

  onError(reason: string, reject?: Rejector) {
    if (reject) {
      reject(reason);
    } else {
      console.error('DB error:', reason);
    }
  }

  onSuccess<T>(key: T, resolve?: Resolver<T>) {
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

  getStoreObservable(name: string, mode?: IDBTransactionMode): Observable<IDBObjectStore> {
    return new Observable<IDBObjectStore>(subscriber => {
      const subscription = new Subscription();
      subscription.add(
        this._isOpen.subscribe(
          open => {
            if (open) {
              subscription.unsubscribe();
              if (this._db.objectStoreNames.contains(name)) {
                const transaction: IDBTransaction = this._db.transaction([name], mode);
                subscriber.next(transaction.objectStore(name));
              } else {
                subscriber.error(`DB error: objectStore '${name}' does not exists.`);
              }
              subscriber.complete();
            }
          },
          error => subscriber.error(error)
        )
      );
    });
  }

  getBooksObservable(): Observable<Book[]> {
    return new Observable<Book[]>(subscriber => {
      this.getStoreObservable(BOOK_STORE_NAME, 'readonly').subscribe(
        store => {
          const request: IDBRequest<Book[]> = store.getAll();
          request.onsuccess = () => {
            subscriber.next(request.result);
            subscriber.complete();
          };
          request.onerror = () =>
            subscriber.error('DB get request error: ' + request.error.message);
        },
        error => subscriber.error(error)
      );
    });
  }

  addObservable(storeName: string, value: any, key?: IDBValidKey): Observable<IDBValidKey> {
    return new Observable<IDBValidKey>(subscriber => {
      this.getStoreObservable(storeName, 'readwrite').subscribe(
        store => {
          const request: IDBRequest<IDBValidKey> = store.add(value, key);
          request.onsuccess = () => {
            subscriber.next(request.result);
            subscriber.complete();
          };
          request.onerror = () =>
            subscriber.error('DB add request error: ' + request.error.message);
        },
        error => subscriber.error(error)
      );
    });
  }

  addBookObservable(name: string, info?: string): Observable<string> {
    const book: Book = { name, info, date: getDate() };
    return this.addObservable(BOOK_STORE_NAME, book) as Observable<string>;
  }

  addCardObservable(isbn: string, name: string, data: string[]): Observable<string> {
    const item: Card = {
      isbn,
      name,
      data
    };
    return this.addObservable(CARD_STORE_NAME, item) as Observable<string>;
  }

  addCardsObservable(isbn: string, data: string[][]): Observable<number> {
    return new Observable<number>(subscriber => {
      this.getStoreObservable(CARD_STORE_NAME, 'readwrite').subscribe(
        store => {
          let percent = 0;
          let index = -1;

          const next = () => {
            NgZone.assertNotInAngularZone();
            index++;
            if (index < data.length) {
              const p = Math.floor((100 * index) / data.length);
              if (p !== percent) {
                percent = p;
                this._ngZone.run(() => subscriber.next(percent));
              }

              const item: Card = {
                isbn,
                name: data[index][0],
                data: data[index].slice(1)
              };
              const request: IDBRequest<IDBValidKey> = store.add(item);
              request.onsuccess = next;
              request.onerror = () => subscriber.error(request.error);
            } else {
              this._ngZone.run(() => {
                subscriber.next(100);
                subscriber.complete();
              });
            }
          };
          this._ngZone.runOutsideAngular(next);
        },
        error => subscriber.error(error)
      );
    });
  }

  add(
    storeName: string,
    value: any,
    key?: IDBValidKey,
    resolve?: Resolver<IDBValidKey>,
    reject?: Rejector
  ) {
    const store: IDBObjectStore = this.getStore(storeName, 'readwrite', reject);
    if (store) {
      const request: IDBRequest<IDBValidKey> = store.add(value, key);
      request.onsuccess = () => this.onSuccess(request.result, resolve);
      request.onerror = () => this.onError('Error while adding the data: ' + request.error, reject);
    }
  }

  _addBook(name: string, info?: string, resolve?: Resolver<IDBValidKey>, reject?: Rejector) {
    const book: Book = { name, info, date: getDate() };
    this.add(BOOK_STORE_NAME, book, undefined, resolve, reject);
  }

  addCard(
    isbn: string,
    name: string,
    data: string[],
    resolve?: Resolver<IDBValidKey>,
    reject?: Rejector
  ) {
    const item: Card = {
      isbn,
      name,
      data
    };
    return this.add(CARD_STORE_NAME, item, undefined, resolve, reject);
  }

  addCards(isbn: string, data: string[][], progress?: Resolver<number>, reject?: Rejector) {
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
          const item: Card = {
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

  getBookKeys(resolve: Resolver<IDBValidKey[]>, reject?: Rejector) {
    const store: IDBObjectStore = this.getStore(BOOK_STORE_NAME, 'readonly', reject);
    if (store) {
      const request: IDBRequest<IDBValidKey[]> = store.getAllKeys();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        this.onError('Error while getting the data: ' + request.error, reject);
    }
  }

  getBooks(resolve: Resolver<Book[]>, reject?: Rejector) {
    const store: IDBObjectStore = this.getStore(BOOK_STORE_NAME, 'readonly', reject);
    if (store) {
      const request: IDBRequest<Book[]> = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        this.onError('Error while getting the data: ' + request.error, reject);
    }
  }
}
