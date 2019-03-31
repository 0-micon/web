import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  pageTitle: string = 'Log In';

  constructor(private _authService: AuthService, private _router: Router) {}

  login(ngForm: NgForm) {
    if (ngForm && ngForm.valid) {
      const username = ngForm.form.value.username;
      const password = ngForm.form.value.password;

      this._authService.login(username, password);

      // Navigate to the Product List Page after log in.
      if (this._authService.redirectUrl) {
        this._router.navigateByUrl(this._authService.redirectUrl);
      } else {
        this._router.navigate(['/products']);
      }
    } else {
      this.errorMessage = 'Please enter a user name and password';
    }
  }

  ngOnInit() {}
}
