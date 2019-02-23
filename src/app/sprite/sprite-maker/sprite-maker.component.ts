interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface FrameHash {
  [key: string]: Frame;
}

type FrameArray = Frame[];

import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit
} from "@angular/core";

@Component({
  selector: "app-sprite-maker",
  templateUrl: "./sprite-maker.component.html",
  styleUrls: ["./sprite-maker.component.css"]
})
export class SpriteMakerComponent implements OnInit, AfterViewInit {
  @ViewChild("canvas")
  canvasRef: ElementRef<HTMLCanvasElement>;

  name: string;
  width: number = 100;
  height: number = 100;

  sprite: ImageBitmap;
  frames: FrameHash;

  get frameNames(): string[] {
    return Object.keys(this.frames);
  }

  selection: number = -1;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit", this.canvasRef.nativeElement);
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

          setTimeout(() => {
            this.paint();
          });
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
              this.paint();
            } catch (error) {
              console.log("Parse Error: " + (error as SyntaxError).message);
            }
          }
        };
        reader.readAsText(file);
      }
    }
  }

  paint(): void {
    if (!this.sprite) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const g = canvas.getContext("2d");
    g.drawImage(this.sprite, 0, 0);

    for (let key in this.frames) {
      const frame = this.frames[key];

      g.strokeRect(frame.x, frame.y, frame.w, frame.h);
    }
  }

  editFrame(name: string): void {}

  deleteFrame(name: string): void {
    if (this.frames[name]) {
      delete this.frames[name];
      this.paint();
    }
  }
}
