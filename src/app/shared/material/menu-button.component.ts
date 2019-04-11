import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from './menu-item';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss']
})
export class MenuButtonComponent implements OnInit {
  @Input()
  name: string;
  @Input()
  items: MenuItem[];

  @Output()
  itemClicked = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

}
