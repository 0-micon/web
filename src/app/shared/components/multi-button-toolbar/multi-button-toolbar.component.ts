import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { IMultiButton } from '../multi-button/multi-button.component';

@Component({
  selector: 'app-multi-button-toolbar',
  templateUrl: './multi-button-toolbar.component.html',
  styleUrls: ['./multi-button-toolbar.component.sass']
})
export class MultiButtonToolbarComponent implements OnInit {
  @Input() buttons: IMultiButton[] = [];
  @Input() tags: string[] = [];

  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  @Output() removeButtonAt = new EventEmitter<number>();
  @Output() addButton = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}
}
