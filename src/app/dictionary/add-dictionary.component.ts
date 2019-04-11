import { Component, OnInit } from '@angular/core';

import { MenuItem, forEach, createMenu } from '../shared/material/menu-item';
import { encodings } from '../shared/encodings';

@Component({
  selector: 'app-add-dictionary',
  templateUrl: './add-dictionary.component.html',
  styleUrls: ['./add-dictionary.component.scss']
})
export class AddDictionaryComponent implements OnInit {
  // The IANA (Internet Assigned Numbers Authority) name for the encoding. For more information about the IANA, see www.iana.org.
  encoding: string;
  // The human-readable description of the encoding.
  encodingDisplayName: string;

  menu: MenuItem;

  constructor() {}

  ngOnInit() {
    // console.log('Encodings', encodings);
    this.menu = {
      name: 'Encoding',
      children: createMenu(encodings)
    };

    this.selectEncoding('utf-8');
  }

  selectFile(file: File) {
    console.log('File', file);
    const reader = new FileReader();
    // reader.onprogress = (ev: ProgressEvent) => {
    //   console.log('Progress', ev);
    // };
    reader.onload = (ev: ProgressEvent) => {
      if (typeof reader.result === 'string') {
        const text: string = reader.result;
        console.log(text.substring(0, 200));
      }
    };
    reader.readAsText(file, this.encoding);
  }

  selectEncoding(encoding: string): void {
    console.log('Encoding:', encoding);
    this.encoding = encoding;
    forEach(this.menu, it => {
      if (it.data === encoding) {
        it.icon = 'check';
      } else if (it.icon) {
        it.icon = undefined;
      }
    });
  }
}
