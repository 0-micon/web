import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FrameHash, Frame } from "../sprite-maker/sprite-maker.component";
import { empty } from "rxjs";

interface IPoint {
  x: number;
  y: number;
}

interface ISize {
  w: number;
  h: number;
}

type IRect = IPoint & ISize;

type IPackedRect = IRect & { value?: any };

class Packer {
  fixed: IPackedRect[] = [];
  empty: IRect[] = [];

  constructor(width: number, height: number) {
    this.empty.push({ x: 0, y: 0, w: width, h: height });
  }

  merge(): boolean {
    for (let i = this.empty.length; i-- > 0; ) {
      const ri = this.empty[i];
      for (let j = i; j-- > 0; ) {
        const rj = this.empty[j];
        // Row Merge.
        if (ri.y == rj.y && ri.h === rj.h) {
          if (ri.x + ri.w === rj.x) {
            rj.x = ri.x;
            rj.w += ri.w;
            this.empty.splice(i, 1);
            return true;
          }
          if (rj.x + rj.w === ri.x) {
            rj.w += ri.w;
            this.empty.splice(i, 1);
            return true;
          }
        }
        // Column Merge.
        if (ri.x == rj.x && ri.w === rj.w) {
          if (ri.y + ri.h === rj.y) {
            rj.y = ri.y;
            rj.h += ri.h;
            this.empty.splice(i, 1);
            return true;
          }
          if (rj.y + rj.h === ri.y) {
            rj.h += ri.h;
            this.empty.splice(i, 1);
            return true;
          }
        }
      }
    }
    return false;
  }

  getBestFit(w: number, h: number): number {
    let best = -1;
    let d = 0;
    for (let i = this.empty.length; i-- > 0; ) {
      const r = this.empty[i];
      if (w <= r.w && h <= r.h) {
        const delta = r.w * r.h - w * h;
        if (best < 0 || d > delta) {
          best = i;
          d = delta;
        }
      }
    }
    return best;
  }

  add(w: number, h: number, value?: any): number {
    while (this.merge());

    const i = this.getBestFit(w, h);
    if (i >= 0) {
      const r: IPackedRect = this.empty[i];
      this.empty.splice(i, 1);
      // If it's not a perfect fit then split the rectangle.
      const dx = r.w - w;
      const dy = r.h - h;
      const xr = r.x + w; // shift right
      const yu = r.y + h; // shift under
      if (dx > 0 && dy > 0) {
        if (dx >= dy) {
          this.empty.push({ x: xr, y: r.y, w: dx, h: r.h });
          this.empty.push({ x: r.x, y: yu, w: w, h: dy });
        } else {
          this.empty.push({ x: r.x, y: yu, w: r.w, h: dy });
          this.empty.push({ x: xr, y: r.y, w: dx, h: h });
        }
      } else if (dx > 0) {
        this.empty.push({ x: xr, y: r.y, w: dx, h: h });
      } else if (dy > 0) {
        this.empty.push({ x: r.x, y: yu, w: w, h: dy });
      }

      r.value = value;
      r.w = w;
      r.h = h;
      this.fixed.push(r);
      return this.fixed.length - 1;
    }
    return -1;
  }
}

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
      if (this.frameWidth === undefined) {
        const delta = this.width * this.height - w * h;
        if (!result.node || result.delta > delta) {
          result.node = this;
          result.delta = delta;
        }
      } else {
        if (this.right) {
          this.right._getBestNode(w, h, result);
        }
        if (this.under) {
          this.under._getBestNode(w, h, result);
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

  //packer: PackerNode;
  packer: Packer;
  allIn: boolean = false;

  constructor(private modal: NgbActiveModal) {}

  ngOnInit() {
    console.log("Frames:", this.frames);

    this.createPacker(this.width, this.height);
  }

  createPacker(w: number, h: number) {
    //this.packer = new PackerNode(w, h);
    this.packer = new Packer(w, h);

    const names = Object.keys(this.frames);
    names.sort(
      (a, b) =>
        this.frames[b].h * this.frames[b].w -
        this.frames[a].h * this.frames[a].w
    );

    for (let i = 0; i < names.length; i++) {
      const frame: Frame = this.frames[names[i]];
      // if (!this.packer.add(frame.w, frame.h, names[i])) {
      //   this.allIn = false;
      // }
      this.packer.add(frame.w, frame.h, names[i]);
      this.allIn = this.packer.fixed.length === names.length;
    }
    console.log("Packer:", this.packer);
  }

  ngAfterViewChecked() {
    const frames = this.frames;
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.width;
    const h = canvas.height;
    const g = canvas.getContext("2d");

    this.createPacker(this.width, this.height);

    g.fillStyle = this.allIn ? "magenta" : "yellow";
    g.fillRect(0, 0, w, h);

    g.strokeStyle = "grey";
    this.packer.fixed.forEach(r => {
      if (this.sprite) {
        const f = frames[r.value];
        g.drawImage(this.sprite, f.x, f.y, f.w, f.h, r.x, r.y, r.w, r.h);
      } else {
        g.strokeRect(r.x, r.y, r.w, r.h);
      }
    });

    g.strokeStyle = "gold";
    this.packer.empty.forEach(r => {
      g.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
    });
    // this.packer.forAll(0, 0, (x, y, w, h, name) => {
    //   if (this.sprite) {
    //     const f = frames[name];
    //     g.drawImage(this.sprite, f.x, f.y, f.w, f.h, x, y, w, h);
    //   } else {
    //     g.strokeRect(x, y, w, h);
    //   }
    // });
  }

  save() {
    this.modal.close("Yes");
  }

  dismiss() {
    this.modal.dismiss("No");
  }
}
