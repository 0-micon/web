import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
// import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user-model';
import {
  MatDrawer,
  MatDialog,
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar
} from '@angular/material';

import { NewContactDialogComponent } from '../new-contact-dialog/new-contact-dialog.component';
import { NavigationService } from '../../services/navigation.service';

const SMALL_SCREEN_WIDTH_QUERY = '(max-width: 720px)';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  private mediaMatcher: MediaQueryList;

  isSmallScreen: boolean;
  users: Observable<UserModel[]>;

  @ViewChild(MatDrawer) drawer: MatDrawer;

  constructor(
    private zone: NgZone,
    private userService: UserService,
    private navigationService: NavigationService,
    // private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  selectUser(userId: number): void {
    this.navigationService.goToUser(userId);
  }

  ngOnInit() {
    this.mediaMatcher = matchMedia(SMALL_SCREEN_WIDTH_QUERY);
    this.isSmallScreen = this.mediaMatcher.matches;

    // tslint:disable-next-line: deprecation
    this.mediaMatcher.addListener(mql =>
      this.zone.run(() => (this.isSmallScreen = mql.matches))
    );

    this.users = this.userService.users;
    this.userService.load();

    const sub = this.users.subscribe(data => {
      if (data.length) {
        this.selectUser(data[0].id);
        sub.unsubscribe();
      }
      // console.log("Users:", data);
    });

    this.navigationService.events.subscribe(() => {
      if (this.isSmallScreen) {
        this.drawer.close();
      }
    });
  }

  openAddContactDialog(): void {
    const dialogRef = this.dialog.open(NewContactDialogComponent, {
      width: '75%',
      height: '75%',
      minWidth: '280px',
      minHeight: '320px',
      maxWidth: '600px',
      maxHeight: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog Result:', result);
      if (result) {
        this.userService.addUser(result).then(user => {
          console.log('New User ID:', user.id);
          this.openSnackBar('Contact added', 'Navigate', 5000)
            .onAction()
            .subscribe(() => {
              this.selectUser(user.id);
            });
        });
      }
    });
  }

  openSnackBar(
    message: string,
    action: string,
    duration: number = 2000
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, { duration });
  }
}
