import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from "@angular/core";
import { NamedFrame } from "../sprite-maker/sprite-maker.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-frame-edit-modal",
  templateUrl: "./frame-edit-modal.component.html",
  styleUrls: ["./frame-edit-modal.component.css"]
})
export class FrameEditModalComponent implements OnInit, AfterViewChecked {
  @ViewChild("canvas")
  canvasRef: ElementRef<HTMLCanvasElement>;
  frame: NamedFrame;
  sprite: ImageBitmap;

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

  ngAfterViewChecked() {
    const frame = this.frame;
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.width;
    const h = canvas.height;
    const g = canvas.getContext("2d");

    g.clearRect(0, 0, w, h);
    if (this.sprite) {
      g.drawImage(this.sprite, frame.x, frame.y, frame.w, frame.h, 0, 0, w, h);
    }
  }

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
