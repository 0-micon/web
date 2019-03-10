import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-contact-manager-app',
  templateUrl: './contact-manager-app.component.html',
  styleUrls: ['./contact-manager-app.component.scss']
})
export class ContactManagerAppComponent implements OnInit {
  themeList: string[] = ['', 'unicorn-dark-theme'];
  themeIndex: number = 0;

  get theme(): string {
    return this.themeList[this.themeIndex];
  }

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private overlayContainer: OverlayContainer
  ) {
    const url: SafeResourceUrl = sanitizer.bypassSecurityTrustResourceUrl(
      'assets/avatars.svg'
    );
    iconRegistry.addSvgIconSet(url);
  }

  ngOnInit() {}

  nextTheme() {
    // Since certain components (e.g. menu, select, dialog, etc.) are inside of a global overlay
    // container, an additional step is required for those components to be affected by the theme's
    // css class selector.
    // To do this, we should add the appropriate class to the global overlay container.

    let theme = this.themeList[this.themeIndex];
    if (theme) {
      this.overlayContainer.getContainerElement().classList.remove(theme);
    }

    if (++this.themeIndex >= this.themeList.length) {
      this.themeIndex = 0;
    }

    theme = this.themeList[this.themeIndex];
    if (theme) {
      this.overlayContainer.getContainerElement().classList.add(theme);
    }
  }
}
