import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { WorkoutsApiService } from "../services/workouts-api.service";
import { NgbDateStruct, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";
import {
  toNgbDateStruct,
  fromNgbDateStruct
} from "../services/date-string-adapter.service";

const ngbDate = (year: number, month: number, day: number): NgbDateStruct => ({
  year,
  month,
  day
});

@Component({
  selector: "app-entry-editor",
  templateUrl: "./entry-editor.component.html",
  styleUrls: ["./entry-editor.component.css"]
})
export class EntryEditorComponent implements OnInit {
  workout: any = {};
  loading: boolean = false;

  start: NgbDateStruct;
  model: NgbDateStruct;
  limit: NgbDateStruct;

  //maxDate: NgbDate;

  constructor(
    private router: ActivatedRoute,
    private nav: Router,
    private api: WorkoutsApiService,
    calendar: NgbCalendar
  ) {
    this.model = calendar.getToday();
    this.start = ngbDate(this.model.year, this.model.month, 1);
    this.limit = ngbDate(this.model.year, this.model.month, this.model.day);
    //    let today = new Date();
    //    this.maxDate = NgbDate.from({
    //      year: today.getFullYear(),
    //      month: today.getMonth() + 1,
    //      day: today.getDate()
    //    });
  }

  ngOnInit() {
    this.router.params.subscribe(params => {
      if (params.id !== "new") {
        this.loading = true;
        this.api.getWorkout(params.id).subscribe(
          data => {
            //const d: NgbDateStruct = toNgbDateStruct(data.date)
            //this.startDate = { year: d.year, month: d.month };
            this.model = toNgbDateStruct(data.date);
            this.start = ngbDate(this.model.year, this.model.month, 1);

            this.workout = data;
            this.loading = false;
            //const d = new Date(data.date);
            //this.startDate = data.date;
            // NgbDate.from({
            //   year: d.getFullYear(),
            //   month: d.getMonth() + 1,
            //   day: d.getDate()
            // });

            //console.log(data);
            //console.log(this.startDate);
          },
          err => {
            this.loading = false;
          }
        );
      }
    });
  }

  save() {
    this.loading = true;
    this.workout.date = fromNgbDateStruct(this.model);
    this.api.saveWorkout(this.workout).subscribe(data => {
      this.loading = false;
      this.nav.navigate(["/workouts"]);
    });
  }
}
