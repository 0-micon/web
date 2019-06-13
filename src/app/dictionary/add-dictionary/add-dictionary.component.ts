import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-dictionary',
  templateUrl: './add-dictionary.component.html',
  styleUrls: ['./add-dictionary.component.scss']
})
export class AddDictionaryComponent implements OnInit {
  words: string[][] = [];
  test: string[];

  constructor() {}

  ngOnInit() {}

  onUpload(data: string[][]) {
    // console.log(data.length);
    // if (data) {
    //   console.log(data[0]);
    // }

    this.words = data;
    this.test = data.map((card: string[]) => card[0]);
  }

  onUploadError(message: string) {
    console.warn(message);
  }
}
