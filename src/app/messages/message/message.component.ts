import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from '../message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  get messages() {
    return this._messageService.messages;
  }

  constructor(private _messageService: MessageService, private _router: Router) {}

  ngOnInit() {}

  close(): void {
    // Close the pop-up.
  }
}
