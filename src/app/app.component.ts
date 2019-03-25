import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo-app';
  isLoggedIn: boolean = false;
  userName: string;

  logOut() {
    this.isLoggedIn = false;
    this.userName = '';
  }
}
