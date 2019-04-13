import { Component, OnInit } from '@angular/core';

import { DictionaryStoreService } from './dictionary-store.service';

import { MenuItem, forEach, createMenu } from '../shared/material/menu-item';
import { encodings } from '../shared/encodings';

// function count(str: string, sub: string): number {
//   let c = 0;
//   for (let i = str.indexOf(sub); i >= 0; i = str.indexOf(sub, i + sub.length)) {
//     c++;
//   }
//   return c;
// }

const regexCard = /(^[^\t\r\n]+)\r?((?:\n\t[^\r\n]*\r?)+)/gm;
const regexText = /\r?\n\t([^\r\n]*)/gm;

@Component({
  selector: 'app-add-dictionary',
  templateUrl: './add-dictionary.component.html',
  styleUrls: ['./add-dictionary.component.scss']
})
export class AddDictionaryComponent implements OnInit {
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

  words: string[] = [];
  lines: string[][] = [];
  selection: number = -1;

  // constructor(private store: DictionaryStoreService) {}
  constructor() {}

  ngOnInit() {
    this.menu = {
      name: 'Encoding',
      children: createMenu(encodings)
    };
    forEach(this.menu, it => {
      if (it.data) {
        it.tooltip = it.data;
      }
    });

    this.encoding = 'utf-8';
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
        this.lines = [];

        // tslint:disable-next-line: no-conditional-assignment
        for (let m: RegExpExecArray; (m = regexCard.exec(this.text)) !== null; ) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regexCard.lastIndex) {
            regexCard.lastIndex++;
          } else {
            this.words.push(m[1]);

            const lines: string[] = [];
            // tslint:disable-next-line: no-conditional-assignment
            for (let n: RegExpExecArray; (n = regexText.exec(m[2])) !== null; ) {
              lines.push(n[1]);
            }

            this.lines.push(lines);
          }

          this.selectWord(0);
        }
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
    if (index >= 0 && index < this.lines.length) {
      this.area = this.lines[index].join('\n');
    } else {
      this.area = '';
    }
  }
}
