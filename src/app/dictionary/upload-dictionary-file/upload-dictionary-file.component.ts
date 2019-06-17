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

export interface UploadEvent {
  name: string;
  data: string[][];
}

@Component({
  selector: 'app-upload-dictionary-file',
  templateUrl: './upload-dictionary-file.component.html',
  styleUrls: ['./upload-dictionary-file.component.scss']
})
export class UploadDictionaryFileComponent implements OnInit {
  model = new UploadDictionaryFileModel();
  showHelp = false;
  loading = false;

  readonly codes = Enc.getEncodings();
  codeDisplayNames: string[];
  buttons: IMultiButton[];
  readonly tags = Object.keys(Enc.getTags(this.codes));

  @Output() uploadChange = new EventEmitter<UploadEvent>();
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
    return !false; // this.model.isValid
  }

  upload(form: NgForm) {
    console.log('onSubmit:', this.model.isValid, new Date());
    if (this.model.isValid) {
      this._readTextFile();
    }
  }

  private _readTextFile(): void {
    const name = this.model.file.name;
    const reader = new FileReader();
    reader.onload = () => {
      this.loading = false;
      if (typeof reader.result === 'string') {
        const words = this.model.parse(reader.result);
        this.uploadChange.emit({ name, data: words });
      }
    };
    reader.onerror = () => {
      this.loading = false;
      this.errorChange.emit(reader.error.message);
    };

    this.loading = true;
    reader.readAsText(this.model.file, this.model.encoding);
  }
}
