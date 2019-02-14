import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { WorkoutsApiService } from "../services/workouts-api.service";

@Component({
  selector: "app-entry-editor",
  templateUrl: "./entry-editor.component.html",
  styleUrls: ["./entry-editor.component.css"]
})
export class EntryEditorComponent implements OnInit {
  workout: any = {};
  loading: boolean = false;

  constructor(
    private router: ActivatedRoute,
    private nav: Router,
    private api: WorkoutsApiService
  ) {}

  ngOnInit() {
    this.router.params.subscribe(params => {
      if (params.id !== "new") {
        this.loading = true;
        this.api.getWorkout(params.id).subscribe(data => {
          this.workout = data;
          this.loading = false;
        }, err => {
          this.loading = false;
        });
      }
    });
  }

  save() {
    this.loading = true;
    this.api.saveWorkout(this.workout).subscribe(data => {
      this.loading = false;
      this.nav.navigate(["/workouts"]);
    });
  }
}
