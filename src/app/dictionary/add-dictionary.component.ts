import { Component, OnInit, ViewChild } from '@angular/core';

import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { MenuItem, forEach, createMenu } from '../shared/material/menu-item';
import { encodings } from '../shared/encodings';

import { DictionaryStoreService, IBook } from './dictionary-store.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material';
import { VirtualViewComponent } from '../shared/material/virtual-view.component';

// function count(str: string, sub: string): number {
//   let c = 0;
//   for (let i = str.indexOf(sub); i >= 0; i = str.indexOf(sub, i + sub.length)) {
//     c++;
//   }
//   return c;
// }

function lowerBound(
  items: string[],
  value: string,
  locales?: string | string[],
  options?: Intl.CollatorOptions
): number {
  let first = 0;
  let last = items.length - 1;

  while (first <= last) {
    const i = Math.floor((last + first) / 2);
    const n = value.localeCompare(items[i], locales, options);
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

const regexCard = /(^[^\t\r\n]+)\r?((?:\n\t[^\r\n]*\r?)+)/gm;
const regexText = /\r?\n\t([^\r\n]*)/gm;

// type IScreenQuery =
//   | 'XSmall'
//   | 'Small'
//   | 'Medium'
//   | 'Large'
//   | 'XLarge'
//   | 'Handset'
//   | 'Tablet'
//   | 'Web'
//   | 'HandsetPortrait'
//   | 'TabletPortrait'
//   | 'WebPortrait'
//   | 'HandsetLandscape'
//   | 'TabletLandscape'
//   | 'WebLandscape';

@Component({
  selector: 'app-add-dictionary',
  templateUrl: './add-dictionary.component.html',
  styleUrls: ['./add-dictionary.component.scss']
})
export class AddDictionaryComponent implements OnInit {
  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger;

  // The IANA (Internet Assigned Numbers Authority) name for the encoding.
  // For more information about the IANA, see www.iana.org.
  private _encoding: string;
  private _file: File;

  get encoding(): string {
    return this._encoding;
  }

  set encoding(value: string) {
    if (this._encoding !== value) {
      this._encoding = value;
      forEach(this.menu, it => {
        if (it.data === value) {
          it.icon = 'check';
        } else if (it.icon) {
          it.icon = undefined;
        }
      });

      if (this._file) {
        this.readTextFile();
      }
    }
  }

  set file(value: File) {
    this.text = '';
    this._file = value;
    this.readTextFile();
  }

  text: string;
  area: string;
  menu: MenuItem;
  errorMessage: string;

  rows: number = 4;

  words: string[][] = [];
  items: string[] = [];

  // lines: string[][] = [];
  selection: number = -1;
  selectedWord: string = '';

  smallScreen$: Observable<BreakpointState>;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  @ViewChild(VirtualViewComponent) virtualView: VirtualViewComponent;

  scrolledIndex: number = 0;
  scrollTopOffset: number = 0;

  // isScreen(query: IScreenQuery): boolean {
  //   console.log('Query:', this._breakpointObserver.isMatched(Breakpoints[query]));
  //   return this._breakpointObserver.isMatched(Breakpoints[query]);
  // }

  // get isScreenSmall(): boolean {
  //   console.log(Breakpoints.Small);
  //   return this._breakpointObserver.isMatched(Breakpoints.Small);
  // }

  constructor(
    private _store: DictionaryStoreService,
    private _breakpointObserver: BreakpointObserver,
    private _fb: FormBuilder
  ) {
    this.smallScreen$ = this._breakpointObserver.observe('(max-width: 600px)');
  }

  ngOnInit() {
    this.firstFormGroup = this._fb.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._fb.group({
      secondCtrl: ['', Validators.required]
    });

    // this._breakpointObserver
    //   .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Web])
    //   .subscribe(result => {
    //     console.log('Breakpoint at:', result);
    //   });

    this.menu = {
      name: 'root',
      children: createMenu(encodings)
    };
    forEach(this.menu, it => {
      if (it.data) {
        it.tooltip = it.data;
      }
    });

    this.encoding = 'utf-8';

    // console.log('MatMenu:', this.matMenu);
  }

  menuOpened() {
    // console.log('MatMenu Open event:', Date.now());
    // this.virtualView.scrollToIndex(this.scrolledIndex);
    if (this.virtualView) {
      this.virtualView.scrollTo({
        top: this.scrollTopOffset
      });
      this.adjustView();
    }
  }

  menuClosed() {
    // console.log('MatMenu Close event:', Date.now());
    if (this.virtualView) {
      this.scrollTopOffset = this.virtualView.measureScrollOffset('top');
    }
  }

  adjustView() {
    if (this.virtualView.index + 10 <= this.selection) {
      this.virtualView.scrollToIndex(this.selection + 1 - 10);
    }
    if (this.virtualView.index > this.selection) {
      this.virtualView.scrollToIndex(this.selection);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const minIndex = 0;
    const maxIndex = this.words.length - 1;
    switch (event.key) {
      // Scroll the content by one line at a time.
      case 'ArrowDown':
        if (this.selection < maxIndex) {
          if (this.trigger.menuOpen) {
            if (event.ctrlKey) {
              this.selectWord(maxIndex);
            } else {
              this.selectWord(this.selection + 1);
            }
          }
        }
        break;
      case 'ArrowUp':
        if (this.selection > minIndex) {
          if (this.trigger.menuOpen) {
            if (event.ctrlKey) {
              this.selectWord(minIndex);
            } else {
              this.selectWord(this.selection - 1);
            }
          }
        }
        break;
      // Page by page scrolling.
      case 'PageDown':
        if (this.trigger.menuOpen && this.selection < maxIndex) {
          this.selectWord(Math.min(this.selection + 10, maxIndex));
        }
        break;
      case 'PageUp':
        if (this.trigger.menuOpen && this.selection > minIndex) {
          this.selectWord(Math.max(this.selection - 10, minIndex));
        }
        break;
    }
  }

  onKeyup(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
      case 'Enter':
        if (this.trigger.menuOpen) {
          this.trigger.closeMenu();
        }
        break;
      case 'ArrowDown':
        if (!this.trigger.menuOpen) {
          this.trigger.openMenu();
        }
        break;
    }
  }

  readTextFile(): void {
    this.errorMessage = '';
    this.selection = -1;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.text = reader.result;
        // this.area = this.text.substring(0, 1024);
        this.words = [];
        // this.lines = [];

        // tslint:disable-next-line: no-conditional-assignment
        for (let m: RegExpExecArray; (m = regexCard.exec(this.text)) !== null; ) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regexCard.lastIndex) {
            regexCard.lastIndex++;
          } else {
            const lines: string[] = [m[1]];
            this.words.push(lines);

            // tslint:disable-next-line: no-conditional-assignment
            for (let n: RegExpExecArray; (n = regexText.exec(m[2])) !== null; ) {
              lines.push(n[1]);
            }
          }
        }

        this.words.sort((a, b) => a[0].localeCompare(b[0]));
        this.items = this.words.map(i => i[0].toLowerCase());

        this.selectWord(0);
        // this.words = this.text.match(regex);
        // this.rows = count(this.area, '\n') + 1;
      }
    };
    reader.onerror = () => {
      this.text = '';
      this.errorMessage = reader.error.message;
    };

    reader.readAsText(this._file, this._encoding);
  }

  selectWord(index: number) {
    this.selection = index;
    if (index >= 0 && index < this.words.length) {
      this.area = this.words[index].join('\n');
      this.selectedWord = this.words[index][0];
    } else {
      this.area = '';
      this.selectedWord = '';
    }
    this.adjustView();
  }

  valueChange(value: string) {
    console.log('New Value:', value);
    const index = lowerBound(this.items, value.toLowerCase());
    console.log('Selection:', index);

    this.selectWord(index);
    this.selectedWord = value;
  }

  addToLibrary() {
    const book: IBook = {
      isbn: '12345',
      title: 'Dictionary',
      year: '2019',
      synopsis: 'Summary'
    };

    this._store
      .getBookByKey(book.isbn)
      .then(value => {
        console.log('DB read:', value);
        if (value) {
          console.log('Book already in DB!');
        } else {
          this._store
            .addBook(book)
            .then(result => console.log('Adding book with result:', result))
            .catch(reason => console.log('Adding book error:', reason));
        }
      })
      .catch(error => console.log('DB error:', error));
  }
}
