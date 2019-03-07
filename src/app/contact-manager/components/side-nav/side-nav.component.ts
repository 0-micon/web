import { Component, OnInit, NgZone } from "@angular/core";

const SMALL_SCREEN_WIDTH_QUERY = "(max-width: 720px)";

@Component({
  selector: "app-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"]
})
export class SideNavComponent implements OnInit {
  private mediaMatcher: MediaQueryList;

  isSmallScreen: boolean;

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.mediaMatcher = matchMedia(SMALL_SCREEN_WIDTH_QUERY);
    this.isSmallScreen = this.mediaMatcher.matches;

    this.mediaMatcher.addListener(mql =>
      this.zone.run(() => (this.isSmallScreen = mql.matches))
    );
  }
}
