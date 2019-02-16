import { Component, OnInit } from "@angular/core";
import { WorkoutsApiService } from "../services/workouts-api.service";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { forkJoin } from "rxjs";
import { PerformanceTargetsModalComponent } from "../performance-targets-modal/performance-targets-modal.component";

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
  perfTargets: any = {};

  constructor(private api: WorkoutsApiService, private modal: NgbModal) {}

  ngOnInit() {
    this.loading = true;
    forkJoin(this.api.getWorkouts(), this.api.getPerfTargets()).subscribe(
      ([workouts, perfTargets]) => {
        this.workouts = (workouts as unknown) as Entry[];
        this.perfTargets = perfTargets;
        this.loading = false;
        console.log("data: ", this.workouts, this.perfTargets);
      },
      err => {
        this.loading = false;
      }
    );

    // this.api.getWorkouts().subscribe(
    //   data => {
    //     this.workouts = (data as unknown) as Entry[];
    //     this.loading = false;
    //   },
    //   err => {
    //     this.loading = false;
    //   }
    // );
  }

  deleteWorkout(id: number, modalTemplate) {
    const options: NgbModalOptions = {
      size: "sm"
    };
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

  showPerfTargets() {
    const modal = this.modal.open(PerformanceTargetsModalComponent);

    modal.componentInstance.perfTargets.run = this.perfTargets.run;
    modal.componentInstance.perfTargets.row = this.perfTargets.row;
    modal.componentInstance.perfTargets.bike = this.perfTargets.bike;

    modal.result.then(
      result => {
        console.log(result);
        // TODO: Save here.
        this.loading = true;
        this.perfTargets.run = result.run;
        this.perfTargets.row = result.row;
        this.perfTargets.bike = result.bike;

        this.api.setPerfTargets(this.perfTargets).subscribe(
          data => {
            // TODO: Handle success.
            this.loading = false;
          },
          err => {
            // TODO: Handle error.
            this.loading = false;
          }
        );
      },
      reason => {
        console.log("Dissmissed with reason: " + reason);
      }
    );
  }
}
