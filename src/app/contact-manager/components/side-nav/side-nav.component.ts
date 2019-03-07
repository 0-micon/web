import { Component, OnInit, NgZone } from "@angular/core";
import { Observable } from "rxjs";

import { UserService } from "../../services/user.service";
import { UserModel } from "../../models/user-model";

const SMALL_SCREEN_WIDTH_QUERY = "(max-width: 720px)";

@Component({
  selector: "app-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"]
})
export class SideNavComponent implements OnInit {
  private mediaMatcher: MediaQueryList;

  isSmallScreen: boolean;
  users: Observable<UserModel[]>;

  constructor(private zone: NgZone, private userService: UserService) {}

  ngOnInit() {
    this.mediaMatcher = matchMedia(SMALL_SCREEN_WIDTH_QUERY);
    this.isSmallScreen = this.mediaMatcher.matches;

    this.mediaMatcher.addListener(mql =>
      this.zone.run(() => (this.isSmallScreen = mql.matches))
    );

    this.users = this.userService.users;
    this.userService.load();

    this.users.subscribe(data => {
      console.log("Users:", data);
    });
  }
}
