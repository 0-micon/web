import { Component, OnInit, Input } from '@angular/core';

interface IHighlightedItem {
  highlighted?: boolean;
  text: string;
}

@Component({
  selector: 'app-highlighter',
  templateUrl: './highlighter.component.html',
  styleUrls: ['./highlighter.component.scss']
})
export class HighlighterComponent implements OnInit {
  @Input()
  text: string = '';

  @Input()
  filter: string = '';

  @Input()
  lowerCaseFilter: boolean = true;

  items(): IHighlightedItem[] {
    let filter = this.filter;
    if (filter) {
      if (this.lowerCaseFilter) {
        filter = filter.toLowerCase();
      }
      let text = this.text;
      if (this.lowerCaseFilter) {
        text = text.toLowerCase();
      }
      if (text) {
        const arr: IHighlightedItem[] = [];
        const fl = filter.length;
        const tl = text.length;
        for (let i = 0; i < tl; ) {
          const j = text.indexOf(filter, i);
          if (j < i) {
            arr.push({ text: this.text.substring(i) });
            break;
          }
          if (j > i) {
            arr.push({ text: this.text.substring(i, j) });
          }
          i = j + fl;
          arr.push({ text: this.text.substring(j, i), highlighted: true });
        }

        return arr;
      }
    }
    return [{ text: this.text }];
  }
  constructor() {}

  ngOnInit() {}
}
