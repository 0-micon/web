import { Component } from '@angular/core';
import { AppAnimation } from './app.animation';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { AuthService } from './user/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [AppAnimation.slideInAnimation]
})
export class AppComponent {
  title = 'Acme Product Management';
  loading: boolean = true;

  get isLoggedIn(): boolean {
    return this._authService.isLoggedIn;
  }

  get username(): string {
    if (this._authService.currentUser) {
      return this._authService.currentUser.username;
    }
    return '';
  }

  logOut() {
    this._authService.logout();
    this._router.navigateByUrl('welcome');
  }

  constructor(private _router: Router, private _authService: AuthService) {
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
