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
  workouts: Entry[] = [];
  perfTargets: any = {};
  total: any = {};
  isCollapsed: boolean = false;

  constructor(private api: WorkoutsApiService, private modal: NgbModal) {}

  ngOnInit() {
    this.loading = true;
    forkJoin(this.api.getWorkouts(), this.api.getPerfTargets()).subscribe(
      ([workouts, perfTargets]) => {
        this.workouts = (workouts as unknown) as Entry[];
        this.perfTargets = perfTargets;
        this.loading = false;
        console.log("data: ", this.workouts, this.perfTargets);
        this.calculatePerformance();
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

  calculatePerformance() {
    let bike = 0,
      row = 0,
      run = 0;
    this.workouts.forEach(item => {
      const n = parseInt(item.distance, 10);
      if (n > 0) {
        switch (item.type) {
          case "bike":
            bike += n;
            break;
          case "row":
            row += n;
            break;
          case "run":
            run += n;
            break;
        }
      }
    });
    this.total = { bike, row, run };
    console.log("totals: ", this.total);
  }

  getPBType(total: number, target: number): string {
    const pct = (total / target) * 100;
    let type = "success";
    if (pct > 25 && pct <= 50) {
      type = "info";
    } else if (pct > 50 && pct <= 75) {
      type = "warning";
    } else if (pct > 75) {
      type = "danger";
    }
    return type;
  }
}
