import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../../services/user.service";
import { UserModel } from "../../models/user-model";

@Component({
  selector: "app-main-content",
  templateUrl: "./main-content.component.html",
  styleUrls: ["./main-content.component.scss"]
})
export class MainContentComponent implements OnInit {
  user: UserModel;

  constructor(private route: ActivatedRoute, private service: UserService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params.id;
      this.service.users.subscribe(users => {
        if (users.length) {
          this.user = this.service.userById(id);
        }
      });
    });
  }
}
