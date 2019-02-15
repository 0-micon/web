import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { WorkoutsApiService } from "../services/workouts-api.service";
import { NgbDateStruct, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";
import {
  toNgbDateStruct,
  fromNgbDateStruct
} from "../services/date-string-adapter.service";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

const ngbDate = (year: number, month: number, day: number): NgbDateStruct => ({
  year,
  month,
  day
});

interface LocationEntry {
  id: number;
  name: string;
}

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

  locations: LocationEntry[];

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
    this.api
      .getLocations()
      .subscribe(
        data => (this.locations = (data as unknown) as LocationEntry[])
      );

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

  locationSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),

      map(term => {
        if (this.locations && term.length > 1) {
          term = term.trim().toLowerCase();
          if (term.length > 1) {
            return this.locations
              .filter(entry => entry.name.toLowerCase().indexOf(term) >= 0)
              .slice(0, 10)
              .map(entry => entry.name);
          }
        }
        return [];
      })
    );
}
