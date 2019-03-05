import { Component, OnInit } from "@angular/core";

const buttonColors = {
  Basic: "",
  Primary: "primary",
  Accent: "accent",
  Warn: "warn"
};

@Component({
  selector: "app-buttons",
  templateUrl: "./buttons.component.html",
  styleUrls: ["./buttons.component.scss"]
})
export class ButtonsComponent implements OnInit {
  buttonIndex = 0;
  buttonName = "Basic";
  buttonColor = "";

  matMiniFabToggle: boolean = false;
  matIconButtonToggle: boolean = false;

  constructor() {}

  ngOnInit() {}

  onClickButton() {
    const names = Object.keys(buttonColors);
    if (++this.buttonIndex >= names.length) {
      this.buttonIndex = 0;
    }

    this.buttonColor =
      buttonColors[(this.buttonName = names[this.buttonIndex])];
  }
}
