import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IMultiButton } from 'src/app/shared/components/multi-button/multi-button.component';
import * as Enc from 'src/app/shared/encodings';
import { UploadDictionaryFileModel } from './upload-dictionary-file.model';

function create(name: string, codes: string[]): IMultiButton {
  const values = Enc.filter(codes, { [name]: true }, 1);
  values.sort();

  const titles = Enc.getDisplayNames(values);

  return { name, values, titles };
}

@Component({
  selector: 'app-upload-dictionary-file',
  templateUrl: './upload-dictionary-file.component.html',
  styleUrls: ['./upload-dictionary-file.component.sass']
})
export class UploadDictionaryFileComponent implements OnInit {
  model = new UploadDictionaryFileModel();
  showHelp = false;

  readonly codes = Enc.getEncodings();
  codeDisplayNames: string[];
  buttons: IMultiButton[];
  readonly tags = Object.keys(Enc.getTags(this.codes));

  @Output() uploadChange = new EventEmitter<string[][]>();
  @Output() errorChange = new EventEmitter<string>();

  removeButton(index: number) {
    this.buttons.splice(index, 1);
  }

  addButton(tag: string) {
    // this.buttons = [...this.buttons, create(tag, this.codes)];
    this.buttons.push(create(tag, this.codes));
  }

  constructor() {}

  ngOnInit() {
    this.buttons = [];
    this.addButton('ASCII');
    this.addButton('Unicode');

    this.tags.sort();
    this.codes.sort();
    this.codeDisplayNames = Enc.getDisplayNames(this.codes);
  }

  canUpload(): boolean {
    return !false;
  }

  upload(form: NgForm) {
    console.log('onSubmit:', this.model.isValid, new Date());
    if (this.model.isValid) {
      this._readTextFile();
    }
  }

  private _readTextFile(): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const words = this.model.parse(reader.result);
        this.uploadChange.emit(words);
      }
    };
    reader.onerror = () => {
      this.errorChange.emit(reader.error.message);
    };

    reader.readAsText(this.model.file, this.model.encoding);
  }
}
