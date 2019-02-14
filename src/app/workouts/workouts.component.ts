import { Component, OnInit } from "@angular/core";
import { WorkoutsApiService } from "../services/workouts-api.service";

//import * as _ from "lodash";

interface Entry {
  date: string;
  type: string;
  distance: string;
  id: number;
}

@Component({
  selector: "app-workouts",
  templateUrl: "./workouts.component.html",
  styleUrls: ["./workouts.component.css"]
})
export class WorkoutsComponent implements OnInit {
  loading: boolean = false;
  workouts = [];

  constructor(private api: WorkoutsApiService) {}

  ngOnInit() {
    this.loading = true;
    this.api.getWorkouts().subscribe(data => {
      this.workouts = (data as unknown) as Entry[];
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  deleteWorkout(id: number) {
    this.api.deleteWorkout(id).subscribe(data => {
      this.workouts = this.workouts.filter(item => item.id !== id);
      //_.remove(this.workouts, { id });
    });
  }
}
