import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { UserModel } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _store: {
    users: UserModel[];
  };

  private _users: BehaviorSubject<UserModel[]>;

  constructor(private http: HttpClient) {
    this._store = { users: [] };
    this._users = new BehaviorSubject([]);
  }

  get users(): Observable<UserModel[]> {
    return this._users.asObservable();
  }

  userById(id: number): UserModel {
// tslint:disable-next-line: triple-equals
    const user: UserModel = this._store.users.find(x => x.id == id);
    return user ? Object.assign({}, user) : null;
  }

  protected _loadAll(): Observable<UserModel[]> {
    const url = 'https://angular-material-api.azurewebsites.net/users';
    return this.http.get<UserModel[]>(url);
  }

  load(): void {
    this._loadAll().subscribe(
      data => {
        this._store.users = data;
        // this._users.next(Object.assign({}, this._store).users);
        this._users.next(data.map(entry => Object.assign({}, entry)));
      },
      error => {
        console.error('Failed to fetch users!', error);
      }
    );
  }

  next(): void {
    const data = this._store.users;
    this._users.next(data.map(entry => Object.assign({}, entry)));
  }

  addUser(user: UserModel): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      const newUser = { ...user };
      newUser.id = this._store.users.length + 1;
      this._store.users.push(newUser);
      this.next();
      resolve(newUser);
    });
  }
}
