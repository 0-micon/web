import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-performance-targets-modal",
  templateUrl: "./performance-targets-modal.component.html",
  styleUrls: ["./performance-targets-modal.component.css"]
})
export class PerformanceTargetsModalComponent implements OnInit {
  perfTargets: any = {};

  constructor(private modal: NgbActiveModal) {}

  ngOnInit() {}

  save() {
    this.modal.close(this.perfTargets);
  }

  dismiss() {
    this.modal.dismiss(0);
  }
}
