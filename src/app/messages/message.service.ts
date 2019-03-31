import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _messages: string[] = [];
  isDisplayed: boolean;

  get messages(): string[] {
    return this._messages;
  }

  add(message: string): void {
    const date = new Date();
    this.messages.push(`[${date.toLocaleString()}] ${message}`);
  }

  constructor() {
    this.add('Starting');
  }
}
