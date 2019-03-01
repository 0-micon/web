import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FrameHash, Frame } from "../sprite-maker/sprite-maker.component";

interface IPoint {
  x: number;
  y: number;
}

interface ISize {
  w: number;
  h: number;
}

type IRect = IPoint & ISize;

class PackerNode {
  frameWidth: number;
  frameHeight: number;
  right: PackerNode;
  under: PackerNode;
  value: any;

  constructor(public width: number, public height: number) {}

  forAll(
    xOffset: number,
    yOffset: number,
    callback: (x: number, y: number, w: number, h: number, value: any) => void
  ) {
    if (this.value) {
      callback(xOffset, yOffset, this.frameWidth, this.frameHeight, this.value);
    }
    if (this.right) {
      this.right.forAll(xOffset + this.frameWidth, yOffset, callback);
    }
    if (this.under) {
      this.under.forAll(xOffset, yOffset + this.frameHeight, callback);
    }
  }

  protected _insert(w: number, h: number, value?: any) {
    this.frameWidth = w;
    this.frameHeight = h;
    this.value = value;
    const dx = this.width - w;
    const dy = this.height - h;
    if (dx > 0 && dy > 0) {
      if (dx >= dy) {
        this.right = new PackerNode(dx, this.height);
        this.under = new PackerNode(w, dy);
      } else {
        this.right = new PackerNode(dx, h);
        this.under = new PackerNode(this.width, dy);
      }
    } else if (dx > 0) {
      this.right = new PackerNode(dx, this.height);
    } else if (dy > 0) {
      this.under = new PackerNode(this.width, dy);
    }
  }

  protected _getBestNode(
    w: number,
    h: number,
    result: { node?: PackerNode; delta?: number }
  ) {
    if (w <= this.width && h <= this.height) {
      if (this.right || this.under) {
        if (this.right) {
          this.right._getBestNode(w, h, result);
        }
        if (this.under) {
          this.under._getBestNode(w, h, result);
        }
      } else {
        const delta = this.width * this.height - w * h;
        if (!result.node || result.delta > delta) {
          result.node = this;
          result.delta = delta;
        }
      }
    }
  }

  add(w: number, h: number, value?: any): boolean {
    const result: { node?: PackerNode; delta?: number } = {};
    this._getBestNode(w, h, result);
    if (result.node) {
      result.node._insert(w, h, value);
      return true;
    }
    return false;
  }
}

@Component({
  selector: "app-frame-pack-modal",
  templateUrl: "./frame-pack-modal.component.html",
  styleUrls: ["./frame-pack-modal.component.css"]
})
export class FramePackModalComponent implements OnInit {
  width: number = 1024;
  height: number = 1024;

  @ViewChild("canvas")
  canvasRef: ElementRef<HTMLCanvasElement>;
  sprite: ImageBitmap;

  frames: FrameHash = {};

  packer: PackerNode;

  constructor(private modal: NgbActiveModal) {}

  ngOnInit() {
    console.log("Frames:", this.frames);

    this.packer = new PackerNode(this.width, this.height);
    const names = Object.keys(this.frames);
    for (let i = 0; i < names.length; i++) {
      const frame: Frame = this.frames[names[i]];
      this.packer.add(frame.w, frame.h, names[i]);
    }
    console.log("Packer:", this.packer);
  }

  ngAfterViewChecked() {
    const frames = this.frames;
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.width;
    const h = canvas.height;
    const g = canvas.getContext("2d");

    g.fillStyle = "magenta";
    g.fillRect(0, 0, w, h);

    g.strokeStyle = "grey";
    this.packer.forAll(0, 0, (x, y, w, h, name) => {
      g.strokeRect(x, y, w, h);
      if (this.sprite) {
        const f = frames[name];
        g.drawImage(this.sprite, f.x, f.y, f.w, f.h, x, y, w, h);
      }
    });
  }

  save() {
    this.modal.close("Yes");
  }

  dismiss() {
    this.modal.dismiss("No");
  }
}
