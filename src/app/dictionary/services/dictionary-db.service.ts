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
  return card[0].toLowerCase();
}

export function wordToTags(word: string): string[] {
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

function filterIn(list: number[], filter: number[]): number[] {
  const len = filter.length;
  let i = 0;
  return list.filter(value => {
    while (i < len && filter[i] < value) {
      i++;
    }
    return i < len && value === filter[i];
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
      word.card_ids = filterOut(word.card_ids, card_ids);
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
      tag.word_ids = filterOut(tag.word_ids, word_ids);
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
  }

  private _getWord(word: string): Promise<Word> {
    return this._getStore(WORD_STORE_NAME).then(store => toPromise(store.index('name').get(word)));
  }

  async getCards(name: string) {
    const word: Word = await this._getWord(name);
    console.log('getCards:', name, word);
    const buffer = [];
    if (word) {
      const store = await this._getStore(CARD_STORE_NAME);
      for (const card_id of word.card_ids) {
        const card: Card = await toPromise(store.get(card_id));
        buffer.push(card.data);
      }
    }
    return buffer;
  }

  async getTags(word: string) {
    word = word.toLowerCase();
    const tags = wordToTags(word);
    const length = tags.length;
    if (length < 1) {
      return [];
    }
    const store = await this._getStore(TAG_STORE_NAME);
    let tagEntry: Tag = await toPromise(store.get(tags[0]));
    if (!tagEntry) {
      return [];
    }

    let words = tagEntry.word_ids;
    for (let i = 1; words.length > 0 && i < length; i++) {
      tagEntry = await toPromise(store.get(tags[i]));
      if (tagEntry) {
        words = filterIn(words, tagEntry.word_ids);
      } else {
        return [];
      }
    }

    if (!words) {
      return [];
    }

    return this.getWords(words);
    // console.log('Words:', words);

    // this._getStore(TAG_STORE_NAME).then(store => {
    //   if (tags.length > 1) {
    //     toPromise(store.get(tags[0])).then((tag: Tag) => )
    //   }
    // });
  }

  async getWords(word_ids: number[]) {
    console.log('Getting words for:', word_ids.length);
    const words: string[] = [];
    const store = await this._getStore(WORD_STORE_NAME);
    for (const key of word_ids) {
      const entry: Word = await toPromise(store.get(key));
      words.push(entry.name);
    }
    return words;
  }

  private async _createTransaction(
    storeNames: string | string[],
    mode: IDBTransactionMode = 'readonly'
  ): Promise<IDBTransaction> {
    await this._openPromise;
    return this._db.transaction(storeNames, mode);
  }

  private async _getStore(
    name: StoreName,
    mode: IDBTransactionMode = 'readonly'
  ): Promise<IDBObjectStore> {
    const transaction = await this._createTransaction([name], mode);
    return transaction.objectStore(name);
  }

  async getBook(book_id: IDBValidKey): Promise<Book> {
    const store = await this._getStore(BOOK_STORE_NAME, 'readonly');
    return toPromise(store.get(book_id));
  }

  async getAllBooks(): Promise<Book[]> {
    const store = await this._getStore(BOOK_STORE_NAME, 'readonly');
    return toPromise(store.getAll());
  }

  async getCardCount(book_id: IDBValidKey): Promise<number> {
    const store = await this._getStore(CARD_STORE_NAME, 'readonly');
    return toPromise(store.index(BOOK_ID).count(book_id));
  }

  async deleteBook(book_id: IDBValidKey, onprogress?: (percent: number) => void): Promise<void> {
    const transaction = await this._createTransaction(
      [BOOK_STORE_NAME, CARD_STORE_NAME, WORD_STORE_NAME, TAG_STORE_NAME],
      'readwrite'
    );
    const book = await toPromise(transaction.objectStore(BOOK_STORE_NAME).get(book_id));
    await new Promise<void>((resolve, reject) => {
      transaction.onerror = () => reject(transaction.error);

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
      tagDelete.onsuccess = () => {
        transaction.onerror = null;
        resolve();
      };
      zone.runOutsideAngular(cardDelete.run);
    });
    return toPromise(transaction.objectStore(BOOK_STORE_NAME).delete(book_id));
  }

  private async _getFirstCardIndex(): Promise<number> {
    const books = await this.getAllBooks();
    let firstCardIndex = 0;
    for (const book of books) {
      firstCardIndex = Math.max(firstCardIndex, book.firstCardIndex + book.cardCount);
    }
    return firstCardIndex;
  }

  async addBook(
    name: string,
    data: string[][],
    info?: string,
    onprogress?: (percent: number) => void
  ): Promise<Book> {
    const firstCardIndex = await this._getFirstCardIndex();
    const book: Book = { name, info, date: getDate(), firstCardIndex, cardCount: data.length };
    return this._addBook(book, data, onprogress);
  }

  private async _addBook(
    book: Book,
    data: string[][],
    onprogress?: (percent: number) => void
  ): Promise<Book> {
    const transaction = await this._createTransaction(
      [BOOK_STORE_NAME, CARD_STORE_NAME, WORD_STORE_NAME, TAG_STORE_NAME],
      'readwrite'
    );
    book.id = await toPromise(transaction.objectStore(BOOK_STORE_NAME).add(book));
    return new Promise<Book>((resolve, reject) => {
      transaction.onerror = () => reject(transaction.error);

      const zone = this._ngZone;
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
      tagUpdate.onsuccess = () => {
        transaction.onerror = null;
        resolve(book);
      };
      zone.runOutsideAngular(cardUpdate.run);
    });
  }

  getCardKeys(book_id: IDBValidKey): Promise<IDBValidKey[]> {
    return this._getStore(CARD_STORE_NAME, 'readonly').then(store =>
      toPromise(store.index(BOOK_ID).getAllKeys(book_id))
    );
  }

  // getCards(query?: IDBValidKey | IDBKeyRange, count?: number): Promise<Card[]> {
  //   return this._getStore(CARD_STORE_NAME, 'readonly').then(store =>
  //     toPromise<Card[]>(store.index('name').getAll(query, count))
  //   );
  // }

  // getCardRange(query: string, count?: number): Promise<Card[]> {
  //   query = query.toLowerCase();
  //   const range = IDBKeyRange.lowerBound(query); // All keys >= query
  //   return this.getCards(range, count);
  // }

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
