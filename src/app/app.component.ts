import { Component } from '@angular/core';
import { AppAnimation } from './app.animation';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';

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
  loading: boolean = true;

  logOut() {
    this.isLoggedIn = false;
    this.userName = '';
  }

  constructor(private _router: Router) {
    _router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        event instanceof NavigationCancel
      ) {
        this.loading = false;
      }
    });
  }
}
