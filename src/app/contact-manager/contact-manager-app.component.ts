import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-contact-manager-app",
  templateUrl: "./contact-manager-app.component.html",
  styleUrls: ["./contact-manager-app.component.scss"]
})
export class ContactManagerAppComponent implements OnInit {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    const url: SafeResourceUrl = sanitizer.bypassSecurityTrustResourceUrl(
      "assets/avatars.svg"
    );
    iconRegistry.addSvgIconSet(url);
  }

  ngOnInit() {}
}
