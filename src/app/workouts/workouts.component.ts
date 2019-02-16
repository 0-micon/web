import { Component, OnInit } from "@angular/core";
import { WorkoutsApiService } from "../services/workouts-api.service";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

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

  constructor(private api: WorkoutsApiService, private modal: NgbModal) {}

  ngOnInit() {
    this.loading = true;
    this.api.getWorkouts().subscribe(
      data => {
        this.workouts = (data as unknown) as Entry[];
        this.loading = false;
      },
      err => {
        this.loading = false;
      }
    );
  }

  deleteWorkout(id: number, modalTemplate) {
    const options: NgbModalOptions = {
      size: 'sm'
    }
    this.modal.open(modalTemplate, options).result.then(
      result => {
        this.api.deleteWorkout(id).subscribe(data => {
          this.workouts = this.workouts.filter(item => item.id !== id);
          //_.remove(this.workouts, { id });
        });
      },
      reason => {
        console.log("Dismissed: " + reason);
      }
    );
  }
}
