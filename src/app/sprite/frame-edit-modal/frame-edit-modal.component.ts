import { Component, OnInit } from "@angular/core";
import { NamedFrame } from "../sprite-maker/sprite-maker.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-frame-edit-modal",
  templateUrl: "./frame-edit-modal.component.html",
  styleUrls: ["./frame-edit-modal.component.css"]
})
export class FrameEditModalComponent implements OnInit {
  frame: NamedFrame;

  get isFrameValid(): boolean {
    const frame = this.frame;
    return !(
      frame.x === null ||
      frame.y === null ||
      frame.w === null ||
      frame.h === null ||
      isNaN(+frame.x) ||
      isNaN(+frame.y) ||
      isNaN(+frame.w) ||
      isNaN(+frame.h)
    );
  }

  constructor(private modal: NgbActiveModal) {}

  ngOnInit() {}

  save() {
    if (this.isFrameValid) {
      console.log("Saving data:", this.frame);
      this.modal.close(this.frame);
    }
  }

  dismiss() {
    this.modal.dismiss();
  }
}
