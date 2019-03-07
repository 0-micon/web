import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, BehaviorSubject } from "rxjs";

import { UserModel } from "../models/user-model";

@Injectable({
  providedIn: "root"
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

  protected _loadAll(): Observable<UserModel[]> {
    const url = "https://angular-material-api.azurewebsites.net/users";
    return this.http.get<UserModel[]>(url);
  }

  load(): void {
    this._loadAll().subscribe(
      data => {
        this._store.users = data;
        this._users.next(Object.assign({}, data));
      },
      error => {
        console.error("Failed to fetch users!", error);
      }
    );
  }
}
