import { Component, OnInit, Input } from '@angular/core';

interface ITextItem {
  marked?: boolean;
  text: string;
}

// [class.text-secondary]="it.marked" [class.bg-success]="it.marked"

@Component({
  selector: 'app-marker',
  // templateUrl: './marker.component.html',
  // styleUrls: ['./marker.component.scss']
  styles: ['.marker { background: yellow; color: black; }'],
  template: '<span *ngFor="let it of items" [class.marker]="it.marked">{{it.text}}</span>'
})
export class MarkerComponent implements OnInit {
  @Input() text = '';
  @Input() filter = '';
  @Input() ignoreCases = true;

  get items(): ITextItem[] {
    let filter = this.filter;
    if (filter) {
      if (this.ignoreCases) {
        filter = filter.toLowerCase();
      }
      let text = this.text;
      if (text) {
        if (this.ignoreCases) {
          text = text.toLowerCase();
        }
        const arr: ITextItem[] = [];
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
          arr.push({ text: this.text.substring(j, i), marked: true });
        }

        return arr;
      }
    }
    return [{ text: this.text }];
  }

  constructor() {}

  ngOnInit() {}
}
