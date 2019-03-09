import { Component, OnInit } from "@angular/core";
import { UserModel } from "../../models/user-model";
import { MatDialogRef } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-new-contact-dialog",
  templateUrl: "./new-contact-dialog.component.html",
  styleUrls: ["./new-contact-dialog.component.scss"]
})
export class NewContactDialogComponent implements OnInit {
  avatars = ["svg-1", "svg-2", "svg-3", "svg-4"];
  user: UserModel;

  name = new FormControl("", [Validators.required]);

  constructor(private dialogRef: MatDialogRef<NewContactDialogComponent>) {}

  get errorMessage() {
    return this.name.hasError("required") ? "You must enter a name" : "";
  }

  ngOnInit() {
    this.user = new UserModel();
    // this.user.avatar = this.avatars[0];
  }

  save(): void {
    this.dialogRef.close(this.user);
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }
}
