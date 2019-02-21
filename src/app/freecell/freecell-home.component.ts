import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-freecell-home",
  templateUrl: "./freecell-home.component.html",
  styleUrls: ["./freecell-home.component.css"]
})
export class FreecellHomeComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {}

  onNewGame() {
    //console.log("Router:", this.router);
    //console.log("ActivatedRoute:", this.activatedRoute);

    this.router.navigate([33], { relativeTo: this.activatedRoute });
  }
}
