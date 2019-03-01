import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  AfterViewChecked
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FrameEditModalComponent } from "../frame-edit-modal/frame-edit-modal.component";
import { FramePackModalComponent } from "../frame-pack-modal/frame-pack-modal.component";

export interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface NamedFrame extends Frame {
  name: string;
}

export interface FrameHash {
  [key: string]: Frame;
}

export type FrameArray = Frame[];

@Component({
  selector: "app-sprite-maker",
  templateUrl: "./sprite-maker.component.html",
  styleUrls: ["./sprite-maker.component.css"]
})
export class SpriteMakerComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild("canvas")
  canvasRef: ElementRef<HTMLCanvasElement>;

  name: string;
  width: number = 100;
  height: number = 100;

  sprite: ImageBitmap;
  frames: FrameHash = {};

  newFrame: NamedFrame = { name: "frame", x: 0, y: 0, w: 1, h: 1 };

  mousedown: boolean = false;

  get frameNames(): string[] {
    return Object.keys(this.frames);
  }

  selection: number = -1;

  constructor(private modal: NgbModal) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit", this.canvasRef.nativeElement);
  }

  ngAfterViewChecked(): void {
    this.repaint();
  }

  loadSprites($event): void {
    console.log("Event: ", $event);
    if ($event.target && $event.target.files[0]) {
      const file: File = $event.target.files[0];
      if (file.type.startsWith("image")) {
        createImageBitmap(file).then(value => {
          this.width = value.width;
          this.height = value.height;
          this.sprite = value;
          this.name = file.name;
          console.log("Success!");

          //setTimeout(() => {
          //  this.repaint();
          //});
        });

        // const reader: FileReader = new FileReader();
        // reader.onload = (ev: ProgressEvent) => {
        //   this.name = file.name;
        //   //console.log("Load Event: ", ev);
        //   const result = (ev.target as FileReader).result;
        //   if (typeof result === "string") {
        //     this.data = result;
        //   }
        // };

        // reader.readAsDataURL(file);
      }
    }
  }

  loadFrames($event) {
    if ($event.target && $event.target.files[0]) {
      const file: File = $event.target.files[0];
      console.log(file.type);
      if (file.type.startsWith("application/json")) {
        const reader: FileReader = new FileReader();
        reader.onload = (ev: ProgressEvent) => {
          const result = (ev.target as FileReader).result;
          if (typeof result === "string") {
            try {
              this.selection = -1;
              this.frames = JSON.parse(result);
              //this.repaint();
            } catch (error) {
              console.log("Parse Error: " + (error as SyntaxError).message);
            }
          }
        };
        reader.readAsText(file);
      }
    }
  }

  repaint(): void {
    const canvas = this.canvasRef.nativeElement;
    const g = canvas.getContext("2d");
    g.save();

    g.clearRect(0, 0, this.width, this.height);
    if (this.sprite) {
      g.drawImage(this.sprite, 0, 0);
    }

    g.globalAlpha = 0.7;

    for (let key in this.frames) {
      const frame = this.frames[key];

      g.fillStyle = "yellow";
      g.fillRect(frame.x, frame.y, frame.w, frame.h);

      g.strokeStyle = "red";
      g.strokeRect(frame.x, frame.y, frame.w, frame.h);
    }

    let x = +this.newFrame.x;
    let y = +this.newFrame.y;
    let w = +this.newFrame.w;
    let h = +this.newFrame.h;
    if (!(isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h))) {
      if (this.mousedown) {
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + w, y + h);

        g.strokeStyle = "grey";
        g.stroke();
      } else {
        g.strokeStyle = "blue";
        g.strokeRect(x + 0.5, y + 0.5, w, h);
      }
    }

    g.restore();
  }

  copyFrame(name: string): void {
    const src = this.frames[name];
    if (src) {
      const dst = this.newFrame;
      dst.x = src.x;
      dst.y = src.y;
      dst.w = src.w;
      dst.h = src.h;

      let i = 1;
      while (this.frames[name + i]) {
        i++;
      }
      dst.name = name + i;
    }
  }

  editFrame(name: string): void {
    const frame = this.frames[name];
    if (frame) {
      const modalRef = this.modal.open(FrameEditModalComponent, {
        size: "lg"
        //windowClass: "mw-100 w-75"
      });
      const componentInstance = modalRef.componentInstance;
      componentInstance.frame = {
        name: name,
        x: frame.x,
        y: frame.y,
        w: frame.w,
        h: frame.h
      };
      componentInstance.sprite = this.sprite;

      modalRef.result.then(data => {
        //console.log("Data:", data);
        const x = +data.x;
        const y = +data.y;
        const h = +data.h;
        const w = +data.w;
        if (!(isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h))) {
          frame.x = x;
          frame.y = y;
          frame.w = w;
          frame.h = h;
        }
      });
    }
  }

  deleteFrame(name: string, confirmDlg): void {
    this.modal.open(confirmDlg, { size: "sm" }).result.then(result => {
      if (this.frames[name]) {
        delete this.frames[name];
      }
    });
  }

  get isNewFrameValid(): boolean {
    const f = this.newFrame;
    return (
      !this.frames[f.name] && +f.x >= 0 && +f.y >= 0 && +f.w > 0 && +f.h > 0
    );
  }

  addFrame(): void {
    if (this.isNewFrameValid) {
      this.frames[this.newFrame.name] = {
        x: +this.newFrame.x,
        y: +this.newFrame.y,
        w: +this.newFrame.w,
        h: +this.newFrame.h
      };
      //this.repaint();
    }
  }

  packFrames() {
    const modalRef = this.modal.open(FramePackModalComponent, {
      size: "lg"
    });
    const componentInstance = modalRef.componentInstance;
    componentInstance.sprite = this.sprite;
    componentInstance.frames = this.frames;

    modalRef.result.then(result => {});
  }

  extractCoords($event: MouseEvent) {
    const target: HTMLCanvasElement = $event.target as HTMLCanvasElement;

    //const style = target.style || window.getComputedStyle(target, null);
    //console.log("style", style);

    //const dx = parseInt(style.borderLeftWidth, 10) || 0;
    //const dy = parseInt(style.borderTopWidth, 10) || 0;
    const rect = target.getBoundingClientRect();
    const xOffset = Math.floor($event.clientX - rect.left);
    const yOffset = Math.floor($event.clientY - rect.top);
    return { xOffset, yOffset };
  }

  onMouseDown($event: MouseEvent) {
    const pos = this.extractCoords($event);

    this.newFrame.x = pos.xOffset;
    this.newFrame.y = pos.yOffset;
    this.newFrame.w = 1;
    this.newFrame.h = 1;
    this.mousedown = true;
    //this.repaint();
  }

  onMouseMove($event: MouseEvent) {
    if (this.mousedown) {
      const pos = this.extractCoords($event);
      this.newFrame.w = pos.xOffset - this.newFrame.x;
      this.newFrame.h = pos.yOffset - this.newFrame.y;
      //this.repaint();
    }
  }

  onMouseUp($event) {
    const pos = this.extractCoords($event);
    this.newFrame.w = pos.xOffset - this.newFrame.x;
    this.newFrame.h = pos.yOffset - this.newFrame.y;

    if (this.newFrame.w < 0) {
      this.newFrame.x += this.newFrame.w;
      this.newFrame.w = -this.newFrame.w;
    }

    if (this.newFrame.h < 0) {
      this.newFrame.y += this.newFrame.h;
      this.newFrame.h = -this.newFrame.h;
    }

    this.mousedown = false;
    //this.repaint();
  }
}
