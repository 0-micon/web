import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _messages: string[] = [];

  get messages(): string[] {
    return this._messages;
  }

  add(message: string): void {
    const date = new Date();
    this.messages.push(`${message} at ${date.toLocaleString()}`);
  }

  constructor() {
    this.add('Starting');
  }
}
