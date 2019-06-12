import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface IMultiButton {
  name: string;
  values: string[];
  titles: string[];
}

@Component({
  selector: 'app-multi-button',
  templateUrl: './multi-button.component.html',
  styleUrls: ['./multi-button.component.sass']
})
export class MultiButtonComponent implements OnInit {
  @Input() classOff = '';
  @Input() classOn = '';

  @Input() name = '';
  @Input() values: string[] = [];
  @Input() titles: string[] = [];
  @Input() selection = 0;

  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  select(index: number): void {
    this.selection = index;
    this.value = this.values[index];
    this.valueChange.emit(this.value);
  }

  constructor() {}

  ngOnInit() {}
}
