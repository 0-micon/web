import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Output()
  toggleMenu: EventEmitter<void> = new EventEmitter();

  @Output()
  addContact: EventEmitter<void> = new EventEmitter();

  @Output()
  nextTheme: EventEmitter<void> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
