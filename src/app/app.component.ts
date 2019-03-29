import { Component } from '@angular/core';
import { AppAnimation } from './app.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [AppAnimation.slideInAnimation]
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
