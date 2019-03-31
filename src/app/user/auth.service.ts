import { Injectable } from '@angular/core';

import { MessageService } from '../messages/message.service';

import { IUser } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: IUser;

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  constructor(private _messageService: MessageService) {}

  login(username: string, password: string): void {
    if (!username || !password) {
      this._messageService.add('Please enter your authentication information');
      return;
    }

    if (username === 'admin') {
      this.currentUser = {
        id: 1,
        username: 'admin',
        isAdmin: true
      };
      this._messageService.add('Admin is in');
    } else {
      this.currentUser = {
        id: 2,
        username,
        isAdmin: false
      };
      this._messageService.add(`User: ${username} logged in`);
    }
  }

  logout(): void {
    if (this.currentUser) {
      this._messageService.add(`User: ${this.currentUser.username} logged out`);
      this.currentUser = null;
    }
  }
}
