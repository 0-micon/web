// tslint:disable: semicolon

import { Injectable, NgZone } from '@angular/core';

// import { BehaviorSubject, Observable, Subscription } from 'rxjs';

const DB_NAME = 'test-library-v-006';
const DB_VERSION = 1;

const KEY_PATH = 'id';
const BOOK_ID = 'book_id';
const CARD_ID = 'card_id';

type StoreName = 'books' | 'cards' | 'words' | 'tags';

const BOOK_STORE_NAME: StoreName = 'books';
const CARD_STORE_NAME: StoreName = 'cards';
const WORD_STORE_NAME: StoreName = 'words';
const TAG_STORE_NAME: StoreName = 'tags';

export interface Book {
  id?: IDBValidKey;
  name: string; // Book's name
  info?: string; // Any additional info
  date: string; // Creation date in YYYY-MM-DD format

  firstCardIndex: number;
  cardCount: number;

  hasIndex?: boolean; // Whether or not this book in the word pool
  hasTags?: boolean; // Whether or not this book in the tag pool
}

export interface Card {
  id?: IDBValidKey;
  book_id: IDBValidKey;
  data: string[];
}

export interface Word {
  id?: IDBValidKey;
  name: string;
  card_ids: number[];
}

export interface Tag {
  name: string;
  word_ids: number[];
}

export type OnProgress = (percent: number) => void;

// function _createKeyStore(db: IDBDatabase, storeName: string): IDBObjectStore {
//   const store: IDBObjectStore = db.createObjectStore(storeName, {
//     keyPath: 'name',
//     autoIncrement: false
//   });
//   return store;
// }

// Mappers/Reducers:
function cardToWord(card: string[]): string {
  // console.log(card);
  // console.log(card[0]);
  return card[0].toLowerCase();
}

function wordToTags(word: string): string[] {
  // const regex = /\p{L}/gm;
  const regex = /[^\d\s()\[\]\-_\.\,\'\n\r\t\0]/;
  const chars = Array.from(word).filter(ch => regex.test(ch));

  const delta = 3;
  const length = chars.length - delta;
  const done: { [key: string]: true } = {};

  for (let i = 0; i <= length; i++) {
    for (let j = i + 1; j <= length + 1; j++) {
      for (let k = j + 1; k <= length + 2; k++) {
        const sub = chars[i] + chars[j] + chars[k];
        if (!done[sub]) {
          done[sub] = true;
        }
      }
    }
  }
  return Object.keys(done);
}

function lowerBound(items: number[], value: number): number {
  let first = 0;
  let last = items.length - 1;

  while (first <= last) {
    const i = Math.floor((last + first) / 2);
    const n = value - items[i];
    if (n < 0) {
      last = i - 1;
    } else if (n > 0) {
      first = i + 1;
    } else {
      return i;
    }
  }
  return last + 1;
}

function insertUnique(items: number[], value: number): void {
  const i = lowerBound(items, value);
  if (i >= items.length) {
    items.push(value);
  } else if (items[i] !== value) {
    items.splice(i, 0, value);
  }
}

function makeUnique(list: number[]): void {
  list.sort((a, b) => a - b);

  const len = list.length;
  let dst = 0;
  for (let src = 0; src < len; ) {
    const value = (list[dst] = list[src]);
    ++dst;
    while (++src < len && list[src] === value) {}
  }

  if (dst < len) {
    list.splice(dst, len - dst);
  }
}

function filterOut(list: number[], filter: number[]): number[] {
  const len = filter.length;
  let i = 0;
  return list.filter(value => {
    while (i < len && filter[i] < value) {
      i++;
    }
    return i >= len || value !== filter[i];
  });
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

class Progress<T> {
  index = -1;
  percent = 0;
  onsuccess: () => void;
  request?: IDBRequest<any>;

  constructor(public data: T[], public ngZone: NgZone, public onprogress?: OnProgress) {}

  progress(): T {
    NgZone.assertNotInAngularZone();
    if (++this.index < this.data.length) {
      this.updateProgress(this.index, this.data.length);
      return this.data[this.index];
    }
    if (this.index === this.data.length) {
      this.onsuccess();
    }
  }

  updateProgress(index: number, length: number) {
    if (this.onprogress) {
      const p = Math.floor((100 * index) / length);
      if (p !== this.percent) {
        this.percent = p;
        this.ngZone.run(this.onprogress, undefined, [p]);
      }
    }
  }
}

class CardUpdate extends Progress<string[]> {
  wordMap = new Map<string, number[]>();

  constructor(
    public store: IDBObjectStore,
    public book: Book,
    data: string[][],
    ngZone: NgZone,
    onprogress?: OnProgress
  ) {
    super(data, ngZone, onprogress);
  }

  run = () => {
    this.next();
  };

  next = () => {
    NgZone.assertNotInAngularZone();
    const data = this.progress();
    if (data) {
      const id = this.book.firstCardIndex + this.index;
      const card: Card = { id, book_id: this.book.id, data };
      this.addWord(data[0], id);
      this.store.add(card).onsuccess = this.next;
    }
  };

  addWord(word: string, card_id: number) {
    word = word.toLowerCase();
    if (this.wordMap.has(word)) {
      this.wordMap.get(word).push(card_id);
    } else {
      this.wordMap.set(word, [card_id]);
    }
  }
}

class CardDelete extends CardUpdate {
  constructor(store: IDBObjectStore, book: Book, ngZone: NgZone, onprogress?: OnProgress) {
    super(store, book, null, ngZone, onprogress);
  }

  run = () => {
    this.request = this.store.index(BOOK_ID).openCursor(this.book.id);
    this.request.onsuccess = this.next;
  };

  next = () => {
    NgZone.assertNotInAngularZone();
    const cursor: IDBCursorWithValue = this.request.result;
    if (cursor) {
      this.index++;
      this.updateProgress(this.index, this.book.cardCount);

      const card: Card = cursor.value;
      this.addWord(card.data[0], +card.id);
      cursor.delete();
      cursor.continue();
    } else {
      this.onsuccess();
    }
  };
}

class WordUpdate extends Progress<string> {
  tagMap = new Map<string, number[]>();

  constructor(
    public store: IDBObjectStore,
    public wordMap: Map<string, number[]>,
    ngZone: NgZone,
    onprogress?: OnProgress
  ) {
    super(null, ngZone, onprogress);
  }

  run = () => {
    this.data = Array.from(this.wordMap.keys());
    this.next();
  };

  next = () => {
    NgZone.assertNotInAngularZone();
    const name = this.progress();
    if (name) {
      this.request = this.store.index('name').get(name);
      this.request.onsuccess = this.update;
    }
  };

  update = () => {
    NgZone.assertNotInAngularZone();
    const name = this.data[this.index];
    const card_ids = this.wordMap.get(name);
    const word: Word = this.request.result;
    if (word) {
      // The word exists. No need to update tags.
      word.card_ids = word.card_ids.concat(card_ids);
      makeUnique(word.card_ids);
      this.request = this.store.put(word);
      this.request.onsuccess = this.next;
    } else {
      // Add a new word and generate tags for it.
      this.request = this.store.add({ name, card_ids });
      this.request.onsuccess = this.getTags;
    }
  };

  getTags = () => {
    NgZone.assertNotInAngularZone();
    this.updateTags(this.data[this.index], this.request.result);
  };

  updateTags(word: string, word_id: number) {
    for (const tag of wordToTags(word)) {
      if (this.tagMap.has(tag)) {
        this.tagMap.get(tag).push(word_id);
      } else {
        this.tagMap.set(tag, [word_id]);
      }
    }
    this.next();
  }
}

class WordDelete extends WordUpdate {
  word_id: number;

  constructor(
    store: IDBObjectStore,
    wordMap: Map<string, number[]>,
    ngZone: NgZone,
    onprogress?: OnProgress
  ) {
    super(store, wordMap, ngZone, onprogress);
  }

  update = () => {
    NgZone.assertNotInAngularZone();
    const name = this.data[this.index];
    const card_ids = this.wordMap.get(name);
    makeUnique(card_ids);

    const word: Word = this.request.result;
    if (word) {
      // console.log(word.card_ids, card_ids);
      word.card_ids = filterOut(word.card_ids, card_ids);
      // console.log(word.card_ids);
      if (word.card_ids.length > 0) {
        // Just update the word.
        this.request = this.store.put(word);
        this.request.onsuccess = this.next;
      } else {
        // Remove the word and update tags.
        this.word_id = +word.id;
        this.request = this.store.delete(word.id);
        this.request.onsuccess = this.getTags;
      }
    } else {
      // TODO: Probably we should throw an Error here.
      this.next();
    }
  };

  getTags = () => {
    NgZone.assertNotInAngularZone();
    this.updateTags(this.data[this.index], this.word_id);
  };
}

class TagUpdate extends Progress<string> {
  constructor(
    public store: IDBObjectStore,
    public tagMap: Map<string, number[]>,
    ngZone: NgZone,
    onprogress?: OnProgress
  ) {
    super(null, ngZone, onprogress);
  }

  run = () => {
    this.data = Array.from(this.tagMap.keys());
    this.next();
  };

  next = () => {
    NgZone.assertNotInAngularZone();
    const name = this.progress();
    if (name) {
      this.request = this.store.get(name);
      this.request.onsuccess = this.update;
    }
  };

  update = () => {
    NgZone.assertNotInAngularZone();
    const name = this.data[this.index];
    const word_ids = this.tagMap.get(name);

    const tag: Tag = this.request.result;
    if (tag) {
      tag.word_ids = tag.word_ids.concat(word_ids);
      makeUnique(tag.word_ids);
      this.request = this.store.put(tag);
    } else {
      makeUnique(word_ids);
      this.request = this.store.add({ name, word_ids });
    }
    this.request.onsuccess = this.next;
  };
}

class TagDelete extends TagUpdate {
  constructor(
    store: IDBObjectStore,
    tagMap: Map<string, number[]>,
    ngZone: NgZone,
    onprogress?: OnProgress
  ) {
    super(store, tagMap, ngZone, onprogress);
  }

  update = () => {
    NgZone.assertNotInAngularZone();
    const name = this.data[this.index];
    const word_ids = this.tagMap.get(name);
    makeUnique(word_ids);

    const tag: Tag = this.request.result;
    if (tag) {
      // console.log(tag.word_ids, word_ids);
      tag.word_ids = filterOut(tag.word_ids, word_ids);
      // console.log(tag.word_ids);
      if (tag.word_ids.length > 0) {
        // Just update the tag.
        this.request = this.store.put(tag);
      } else {
        // Remove an empty tag from the DB.
        this.request = this.store.delete(tag.name);
      }
      this.request.onsuccess = this.next;
    } else {
      // TODO: Probably we should throw an Error here.
      this.next();
    }
  };
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

  private _createTransaction(
    storeNames: string | string[],
    mode: IDBTransactionMode = 'readonly'
  ): Promise<IDBTransaction> {
    return this._openPromise.then(() => this._db.transaction(storeNames, mode));
  }

  private _getStore(name: StoreName, mode?: IDBTransactionMode): Promise<IDBObjectStore> {
    return this._createTransaction([name], mode).then(transaction => transaction.objectStore(name));
  }

  getBook(book_id: IDBValidKey): Promise<Book> {
    return this._getStore(BOOK_STORE_NAME, 'readonly').then(store => toPromise(store.get(book_id)));
  }

  getAllBooks(): Promise<Book[]> {
    return this._getStore(BOOK_STORE_NAME, 'readonly').then(store => toPromise(store.getAll()));
  }

  getCardCount(book_id: IDBValidKey): Promise<number> {
    return this._getStore(CARD_STORE_NAME, 'readonly').then(store =>
      toPromise(store.index(BOOK_ID).count(book_id))
    );
  }

  private _deleteCards(
    book_id: IDBValidKey,
    count: number,
    onprogress: (percent: number) => void
  ): Promise<void> {
    return this._getStore(CARD_STORE_NAME, 'readwrite').then(store =>
      this._runStoreOutsideAngular(store, () => {
        let done = 0;
        let percent = 0;
        const request = store.index(BOOK_ID).openCursor(book_id);
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

  private _clearCards(book_id: IDBValidKey): Promise<void> {
    return this._getStore(CARD_STORE_NAME, 'readwrite').then(store =>
      this._runStoreOutsideAngular(store, () => {
        const request = store.index(BOOK_ID).openCursor(book_id);
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
  private _runTransactionOutsideAngular(
    transaction: IDBTransaction,
    task: () => void
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => this._ngZone.run(resolve);
      transaction.onerror = () => this._ngZone.run(() => reject(transaction.error));
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

  deleteCards(book_id: IDBValidKey, onprogress?: (percent: number) => void): Promise<void> {
    if (onprogress) {
      return this.getCardCount(book_id).then(count =>
        this._deleteCards(book_id, count, onprogress)
      );
    } else {
      return this._clearCards(book_id);
    }
  }

  private _deleteCardRange(begin: number, end: number): Promise<void> {
    return this._getStore(CARD_STORE_NAME, 'readwrite').then(store =>
      toPromise(store.delete(IDBKeyRange.bound(begin, end, false, true)))
    );
  }

  deleteBook(book_id: IDBValidKey, onprogress?: (percent: number) => void): Promise<void> {
    return this._createTransaction(
      [BOOK_STORE_NAME, CARD_STORE_NAME, WORD_STORE_NAME, TAG_STORE_NAME],
      'readwrite'
    ).then(transaction =>
      toPromise(transaction.objectStore(BOOK_STORE_NAME).get(book_id))
        .then(
          book =>
            new Promise<void>((resolve, reject) => {
              const zone = this._ngZone;

              const cardDelete = new CardDelete(
                transaction.objectStore(CARD_STORE_NAME),
                book,
                zone,
                onprogress
              );
              const wordDelete = new WordDelete(
                transaction.objectStore(WORD_STORE_NAME),
                cardDelete.wordMap,
                zone,
                onprogress
              );
              const tagDelete = new TagDelete(
                transaction.objectStore(TAG_STORE_NAME),
                wordDelete.tagMap,
                zone,
                onprogress
              );
              cardDelete.onsuccess = wordDelete.run;
              wordDelete.onsuccess = tagDelete.run;
              tagDelete.onsuccess = () => resolve();
              zone.runOutsideAngular(cardDelete.run);
            })
        )
        .then(() => toPromise(transaction.objectStore(BOOK_STORE_NAME).delete(book_id)))
    );
    // return this.getBook(book_id)
    //   .then(book =>
    //     this._deleteCardRange(book.firstCardIndex, book.firstCardIndex + book.cardCount)
    //   )
    //   .then(() => this._getStore(BOOK_STORE_NAME, 'readwrite'))
    //   .then(store => toPromise(store.delete(book_id)));

    // return this.deleteCards(book_id, onprogress)
    //   .then(() => this._getStore(BOOK_STORE_NAME, 'readwrite'))
    //   .then(store => toPromise(store.delete(book_id)));
  }

  private _addTags(book_id: IDBValidKey) {
    return this._getStore(CARD_STORE_NAME, 'readonly').then(store =>
      this._runStoreOutsideAngular(store, () => {
        const request = store.index(BOOK_ID).openCursor(book_id);
        request.onsuccess = () => {
          NgZone.assertNotInAngularZone();
          const cursor = request.result;
          if (cursor) {
            const card: Card = cursor.value;

            cursor.continue();
          }
        };
      })
    );
  }

  addTags(book_id: IDBValidKey) {
    return this.getBook(book_id).then(book =>
      book.hasTags ? Promise.reject(new Error('Already has tags')) : this._addTags(book_id)
    );
  }

  private _getFirstCardIndex(): Promise<number> {
    return this.getAllBooks().then(books => {
      let firstCardIndex = 0;
      for (const book of books) {
        firstCardIndex = Math.max(firstCardIndex, book.firstCardIndex + book.cardCount);
      }
      return firstCardIndex;
    });
  }

  addBook(
    name: string,
    data: string[][],
    info?: string,
    onprogress?: (percent: number) => void
  ): Promise<Book> {
    // return this._getFirstCardIndex().then(firstCardIndex => {
    //   const book: Book = { name, info, date: getDate(), firstCardIndex, cardCount: data.length };
    //   return this._getStore(BOOK_STORE_NAME, 'readwrite')
    //     .then(store => toPromise(store.add(book)))
    //     .then(book_id => this._addCards(book_id, data, firstCardIndex, onprogress))
    //     .then(book_id => this._addWords(book_id, data, firstCardIndex, onprogress));
    // });
    return this._getFirstCardIndex().then(firstCardIndex =>
      this._addBook(
        { name, info, date: getDate(), firstCardIndex, cardCount: data.length },
        data,
        onprogress
      )
    );
  }

  private _addBook(
    book: Book,
    data: string[][],
    onprogress?: (percent: number) => void
  ): Promise<Book> {
    return this._createTransaction(
      [BOOK_STORE_NAME, CARD_STORE_NAME, WORD_STORE_NAME, TAG_STORE_NAME],
      'readwrite'
    ).then(transaction =>
      toPromise(transaction.objectStore(BOOK_STORE_NAME).add(book)).then(
        id =>
          new Promise<Book>((resolve, reject) => {
            const zone = this._ngZone;
            book.id = id;
            const cardUpdate = new CardUpdate(
              transaction.objectStore(CARD_STORE_NAME),
              book,
              data,
              zone,
              onprogress
            );
            const wordUpdate = new WordUpdate(
              transaction.objectStore(WORD_STORE_NAME),
              cardUpdate.wordMap,
              zone,
              onprogress
            );
            const tagUpdate = new TagUpdate(
              transaction.objectStore(TAG_STORE_NAME),
              wordUpdate.tagMap,
              zone,
              onprogress
            );
            cardUpdate.onsuccess = wordUpdate.run;
            wordUpdate.onsuccess = tagUpdate.run;
            tagUpdate.onsuccess = () => resolve(book);
            zone.runOutsideAngular(cardUpdate.run);
          })
      )
    );
  }

  private _addTags_3(
    transaction: IDBTransaction,
    tags: Map<string, number[]>,
    onprogress?: OnProgress
  ) {}

  private _addWords_3(
    transaction: IDBTransaction,
    map: Map<string, number[]>,
    onprogress?: OnProgress
  ) {
    const tags = new Map<string, number[]>();
    const store = transaction.objectStore(WORD_STORE_NAME);
    const words = Array.from(map.keys());

    let index = -1;
    let percent = 0;

    const state: {
      request?: IDBRequest<any>;
      next?: () => void;
      update?: () => void;
      tags?: () => void;
    } = {};

    state.next = () => {
      NgZone.assertNotInAngularZone();
      if (++index < words.length) {
        if (onprogress) {
          const p = Math.floor(((100 * index) / words.length + 100) / 3);
          if (p !== percent) {
            percent = p;
            this._ngZone.run(onprogress, undefined, [p]);
          }
        }

        state.request = store.index('name').get(words[index]);
        state.request.onsuccess = state.update;
      } else {
        this._addTags_3(transaction, tags, onprogress);
      }
    };

    state.update = () => {
      NgZone.assertNotInAngularZone();
      const name = words[index];
      const card_ids = map.get(name);
      const word: Word = state.request.result;
      if (word) {
        word.card_ids = word.card_ids.concat(card_ids);
        makeUnique(word.card_ids);
        state.request = store.put(word);
        state.request.onsuccess = state.next;
      } else {
        state.request = store.add({ name, card_ids });
        state.request.onsuccess = state.tags;
      }
    };

    state.tags = () => {
      NgZone.assertNotInAngularZone();
      const word_id: number = state.request.result;
      for (const t of wordToTags(words[index])) {
        if (tags.has(t)) {
          tags.get(t).push(word_id);
        } else {
          tags.set(t, [word_id]);
        }
      }
      state.next();
    };
  }

  private _addCards_3(
    transaction: IDBTransaction,
    book: Book,
    data: string[][],
    onprogress?: (percent: number) => void
  ) {
    const map = new Map<string, number[]>();
    const store = transaction.objectStore(CARD_STORE_NAME);
    const book_id = book.id;

    let index = -1;
    let percent = 0;

    const next = () => {
      NgZone.assertNotInAngularZone();
      if (++index < data.length) {
        if (onprogress) {
          const p = Math.floor((100 * index) / data.length / 3);
          if (p !== percent) {
            percent = p;
            this._ngZone.run(onprogress, undefined, [p]);
          }
        }

        const id = book.firstCardIndex + index;
        const card: Card = { id, book_id, data: data[index] };
        const word = cardToWord(data[index]);
        if (map.has(word)) {
          map.get(word).push(id);
        } else {
          map.set(word, [id]);
        }
        store.add(card).onsuccess = next;
      } else {
        this._addWords_3(transaction, map, onprogress);
      }
    };
  }

  private _addCards_2(
    transaction: IDBTransaction,
    book: Book,
    data: string[][],
    onprogress?: (percent: number) => void
  ): Promise<Book> {
    const state: any = {
      index: -1,
      percent: 0,
      tags: {},
      cardStore: transaction.objectStore(CARD_STORE_NAME),
      wordStore: transaction.objectStore(WORD_STORE_NAME),
      tagStore: transaction.objectStore(TAG_STORE_NAME)
    };

    state.nextWord = () => {
      NgZone.assertNotInAngularZone();
      state.index++;
      if (onprogress) {
        const p = state.index < data.length ? Math.floor((100 * state.index) / data.length) : 100;
        if (p !== state.percent) {
          state.percent = p;
          this._ngZone.run(onprogress, undefined, [p]);
        }
      }
      if (state.index < data.length) {
        state.card_id = book.firstCardIndex + state.index;
        state.name = cardToWord(data[state.index]);
        state.request = state.wordStore.index('name').get(state.name);
        state.request.onsuccess = state.updateWord;
      } else {
        state.addTags();
      }
    };

    state.updateWord = () => {
      NgZone.assertNotInAngularZone();
      let word: Word = state.request.result;
      if (word) {
        insertUnique(word.card_ids, state.card_id);
        state.request = state.wordStore.put(word);
      } else {
        word = { name: state.name, card_ids: [state.card_id] };
        state.request = state.wordStore.add(word);
      }
      state.request.onsuccess = state.updateTags;
    };

    state.updateTags = () => {
      NgZone.assertNotInAngularZone();
      // state.word_id = state.request.result;
      // state.tags = wordToTags(state.name);
      // state.tag_index = -1;
      // state.nextTag();
      const word_id = state.request.result;
      for (const tag of wordToTags(state.name)) {
        if (state.tags[tag]) {
          insertUnique(state.tags[tag], word_id);
        } else {
          state.tags[tag] = [word_id];
        }
      }
      state.nextCard();
    };

    state.addTags = () => {
      NgZone.assertNotInAngularZone();
      state.tag_keys = Object.keys(state.tags);
      state.tag_index = 0;
      state.nextTag();
    };

    state.nextTag = () => {
      NgZone.assertNotInAngularZone();
      if (state.tag_index < state.tag_keys.length) {
        const name = state.tag_keys[state.tag_index];
        state.request = state.tagStore.get(name);
        state.request.onsuccess = state.updateTag;
      }
      // state.tag_index++;
      // if (state.tag_index < state.tags.length) {
      //   state.request = state.tagStore.get(state.tags[state.tag_index]);
      //   state.request.onsuccess = state.updateTag;
      // } else {
      //   state.nextCard();
      // }
    };

    state.updateTag = () => {
      NgZone.assertNotInAngularZone();
      // let tag: Tag = state.request.result;
      // if (tag) {
      //   insertUnique(tag.word_ids, state.word_id);
      //   state.request = state.tagStore.put(tag);
      // } else {
      //   tag = { name: state.tags[state.tag_index], word_ids: [state.word_id] };
      //   state.request = state.tagStore.add(tag);
      // }
      const name = state.tag_keys[state.tag_index];
      const word_ids = state.tags[name];

      let tag: Tag = state.request.result;
      if (tag) {
        tag.word_ids = tag.word_ids.concat(word_ids);
        makeUnique(tag.word_ids);
        state.request = state.tagStore.put(tag);
      } else {
        tag = { name, word_ids };
        state.request = state.tagStore.add(tag);
      }
      state.tag_index++;
      state.request.onsuccess = state.nextTag;
    };

    state.nextCard = () => {
      NgZone.assertNotInAngularZone();
      const item: Card = { book_id: book.id, data: data[state.index], id: state.card_id };
      state.request = state.cardStore.add(item);
      state.request.onsuccess = state.nextWord;
    };
    return this._runTransactionOutsideAngular(transaction, state.nextWord).then(() =>
      Promise.resolve(book)
    );
  }

  private _addCards(
    book_id: IDBValidKey,
    data: string[][],
    firstCardIndex: number,
    onprogress?: (percent: number) => void
  ): Promise<IDBValidKey> {
    return this._getStore(CARD_STORE_NAME, 'readwrite')
      .then(store => {
        let percent = 0;
        let index = 0;
        const next = () => {
          NgZone.assertNotInAngularZone();
          if (index < data.length) {
            const item: Card = { book_id, data: data[index], id: firstCardIndex + index };
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
      .then(() => Promise.resolve(book_id));
  }

  private _addWords(
    book_id: IDBValidKey,
    data: string[][],
    firstCardIndex: number,
    onprogress?: (percent: number) => void
  ): Promise<IDBValidKey> {
    return this._getStore(WORD_STORE_NAME, 'readwrite')
      .then(store => {
        let percent = 0;
        let index = 0;
        const next = () => {
          NgZone.assertNotInAngularZone();
          if (index < data.length) {
            const name = cardToWord(data[index]);
            const card_id = firstCardIndex + index;
            index++;
            if (onprogress) {
              const p = Math.floor((100 * index) / data.length);
              if (p !== percent) {
                percent = p;
                this._ngZone.run(onprogress, undefined, [p]);
              }
            }
            const request = store.get(name);
            request.onsuccess = () => {
              let word: Word = request.result;
              if (word) {
                insertUnique(word.card_ids, card_id);
              } else {
                word = { name, card_ids: [card_id] };
              }
              store.put(word).onsuccess = next;
            };
          }
        };
        return this._runStoreOutsideAngular(store, next);
      })
      .then(() => Promise.resolve(book_id));
  }

  getCardKeys(book_id: IDBValidKey): Promise<IDBValidKey[]> {
    return this._getStore(CARD_STORE_NAME, 'readonly').then(store =>
      toPromise(store.index(BOOK_ID).getAllKeys(book_id))
    );
  }

  getCardToWordMap(book_id: IDBValidKey): Promise<Map<IDBValidKey, string>> {
    const names = new Map<IDBValidKey, string>();
    return this._getStore(CARD_STORE_NAME, 'readonly')
      .then(store =>
        this._runStoreOutsideAngular(store, () => {
          const request = store.index(BOOK_ID).openCursor(book_id);
          request.onsuccess = () => {
            NgZone.assertNotInAngularZone();
            const cursor = request.result;
            if (cursor) {
              const card: Card = cursor.value as Card;
              // names.set(cursor.key, card.data[0].toLowerCase());
              cursor.continue();
            }
          };
        })
      )
      .then(() => Promise.resolve(names));
  }

  // addWords(book_id: IDBValidKey): Promise<void> {
  //   return this.getCardToWordMap(book_id).then(map =>
  //     this._getStore(WORD_STORE_NAME, 'readwrite').then(store => {
  //       const iterator = map.keys();
  //       const next = () => {
  //         NgZone.assertNotInAngularZone();
  //         const x = iterator.next();
  //         if (!x.done) {
  //           const item: Word = { name: map.get(x.value), card_id: x.value };
  //           store.add(item).onsuccess = next;
  //         }
  //       };
  //       return this._runStoreOutsideAngular(store, next);
  //     })
  //   );
  // }

  deleteWords(book_id: IDBValidKey): Promise<void> {
    return this.getCardKeys(book_id).then(cards =>
      this._getStore(WORD_STORE_NAME, 'readwrite').then(store =>
        this._runStoreOutsideAngular(store, () => {
          const request = store.index(CARD_ID).openCursor(cards);
          request.onsuccess = () => {
            NgZone.assertNotInAngularZone();
            const cursor = request.result;
            if (cursor) {
              cursor.delete();
              cursor.continue();
            }
          };
        })
      )
    );
  }

  getCards(query?: IDBValidKey | IDBKeyRange, count?: number): Promise<Card[]> {
    return this._getStore(CARD_STORE_NAME, 'readonly').then(store =>
      toPromise<Card[]>(store.index('name').getAll(query, count))
    );
  }

  getCardRange(query: string, count?: number): Promise<Card[]> {
    query = query.toLowerCase();
    const range = IDBKeyRange.lowerBound(query); // All keys >= query
    return this.getCards(range, count);
  }

  getWord(name: string): Promise<Word> {
    return this._getStore(WORD_STORE_NAME, 'readonly').then(store => toPromise(store.get(name)));
  }

  addWord(name: string, card_id: number) {
    return this._getStore(WORD_STORE_NAME, 'readwrite').then(store =>
      toPromise(store.get(name)).then((word: Word) => {
        if (word) {
          insertUnique(word.card_ids, card_id);
        } else {
          word = { name, card_ids: [card_id] };
        }
        return toPromise(store.put(word));
      })
    );
  }

  // putWord(word: Word): Promise<IDBValidKey> {
  //   return this._getStore(WORD_STORE_NAME, 'readwrite').then(store => toPromise(store.put(word)));
  // }

  // Handles the event whereby a new version of the database needs to be created.
  // Either one has not been created before, or a new version number has been submitted
  // via the window.indexedDB.open.
  onUpgradeNeeded(request: IDBOpenDBRequest) {
    this._db = request.result;

    // Create an objectStore for this database.
    // Records within an object store are sorted according to their keys.
    // This sorting enables fast insertion, look-up, and ordered retrieval.
    const bookStore: IDBObjectStore = this._db.createObjectStore(BOOK_STORE_NAME, {
      keyPath: KEY_PATH,
      autoIncrement: true
    });

    // define what data items the objectStore will contain
    bookStore.createIndex('name', 'name', { unique: false });
    bookStore.createIndex('date', 'date', { unique: false });

    const cardStore: IDBObjectStore = this._db.createObjectStore(CARD_STORE_NAME, {
      keyPath: KEY_PATH,
      autoIncrement: true
    });
    cardStore.createIndex(BOOK_ID, BOOK_ID, { unique: false });

    const wordStore: IDBObjectStore = this._db.createObjectStore(WORD_STORE_NAME, {
      keyPath: KEY_PATH,
      autoIncrement: true
    });
    wordStore.createIndex('name', 'name', { unique: true });

    this._db.createObjectStore(TAG_STORE_NAME, { keyPath: 'name', autoIncrement: false });
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
