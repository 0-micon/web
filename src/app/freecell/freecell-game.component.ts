import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";

abstract class EventListener {
  private _target: EventTarget = null;

  abstract addListener(): void;
  abstract removeListener(): void;

  get target(): EventTarget {
    return this._target;
  }

  set target(target: EventTarget) {
    if (this._target) {
      this.removeListener();
    }
    this._target = target;
    if (this._target) {
      this.addListener();
    }
  }
}

interface IKeyboard {
  [key: string]: boolean;
}

interface IKeyboardMap {
  [key: string]: string;
}

class KeyboardListener extends EventListener {
  input: IKeyboard = {};
  mapping: IKeyboardMap = {};

  onKeyDown?: (key: string) => void;
  onKeyUp?: (key: string) => void;

  // Event Listeners:
  keydown = (event: KeyboardEvent) => {
    const key = this.mapping[event.key];
    if (key) {
      this.input[key] = true;
      if (this.onKeyDown) {
        this.onKeyDown(key);
      }
    }
  };

  keyup = (event: KeyboardEvent) => {
    const key = this.mapping[event.key];
    if (key) {
      this.input[key] = false;
      if (this.onKeyUp) {
        this.onKeyUp(key);
      }
    }
  };

  addListener(): void {
    this.target.addEventListener("keydown", this.keydown);
    this.target.addEventListener("keyup", this.keyup);
  }

  removeListener(): void {
    this.target.removeEventListener("keydown", this.keydown);
    this.target.removeEventListener("keyup", this.keyup);
  }
}

interface IMouse {
  x: number;
  y: number;
  down?: boolean;
  button?: number;
}

class MouseListener extends EventListener {
  input: IMouse = { x: NaN, y: NaN };

  // Event Listeners:
  move = (event: MouseEvent) => {
    //    if (this.target instanceof Element) {
    // necessary to take into account CSS boundaries
    //      const rect = this.target.getBoundingClientRect();
    //      this.input.x = Math.floor(event.clientX - rect.left);
    //      this.input.y = Math.floor(event.clientY - rect.top);
    //    } else {
    this.input.x = event.offsetX;
    this.input.y = event.offsetY;
    //    }
  };

  down = (event: MouseEvent) => {
    this.input.down = true;
    this.input.button = event.button;
    this.input.x = event.offsetX;
    this.input.y = event.offsetY;
  };

  up = (event: MouseEvent) => {
    this.input.down = false;
    this.input.x = event.offsetX;
    this.input.y = event.offsetY;
  };

  leave = (event: MouseEvent) => {
    this.input.x = this.input.y = NaN;
  };

  addListener(): void {
    this.target.addEventListener("mousemove", this.move);
    this.target.addEventListener("mousedown", this.down);
    this.target.addEventListener("mouseup", this.up);
    this.target.addEventListener("mouseleave", this.leave);
  }

  removeListener(): void {
    this.target.removeEventListener("mousemove", this.move);
    this.target.removeEventListener("mousedown", this.down);
    this.target.removeEventListener("mouseup", this.up);
    this.target.removeEventListener("mouseleave", this.leave);
  }
}

class FpsCounter {
  // frames per second
  fps: number = 0;
  fpsTime: number = 0;
  frameCount: number = 0;
  // old frames discarding time in milliseconds
  discardDelta: number = 1000;

  measureFPS(time: number): void {
    if (this.fpsTime === 0) {
      // Start frame counting.
      this.fps = 0;
      this.fpsTime = time;
      this.frameCount = 0;
    } else {
      this.frameCount++;
      const delta = time - this.fpsTime;
      if (delta >= this.discardDelta) {
        const fps = Math.round((1000 * this.frameCount) / delta);
        if (fps !== this.fps) {
          this.fps = fps;
        }

        // Discard old frames from the counter.
        this.fpsTime = time;
        this.frameCount = 0;
      }
    }
  }
}

type Graphics2D = CanvasRenderingContext2D;

interface CanvasAppOptions {
  ready?: boolean;
  fps?: boolean;
  play?: boolean;
  width?: number;
  height?: number;
}

type CanvasAppCommands = "fps" | "play" | "stop";

class CanvasApp {
  graphics: CanvasRenderingContext2D;
  keyboard = new KeyboardListener();
  mouse = new MouseListener();

  fpsCounter: FpsCounter = new FpsCounter();

  // Abstracts:
  update?: (time: number, self: CanvasApp) => void;
  paint?: (time: number, self: CanvasApp) => void;

  constructor(
    public canvas: HTMLCanvasElement,
    public options: CanvasAppOptions = {},
    public callback: (
      x: FrameRequestCallback
    ) => number = window.requestAnimationFrame
  ) {
    this.graphics = this.canvas.getContext("2d");
    this.options.width = this.canvas.width;
    this.options.height = this.canvas.height;

    this.keyboard.onKeyUp = (key: CanvasAppCommands) => {
      switch (key) {
        case "fps":
          this.options.fps = !this.options.fps;
          break;
        case "play":
          if (!this.options.play) {
            this.play();
          }
          break;
        case "stop":
          if (this.options.play) {
            this.stop();
          } else {
            this.play();
          }
          break;
      }
    };
  }

  next: FrameRequestCallback = (time: number) => {
    if (this.options.fps) {
      this.fpsCounter.measureFPS(time);
    }

    if (this.update) {
      this.update(time, this);
    }
    if (this.paint) {
      this.paint(time, this);
    }

    if (this.options.play) {
      this.callback(this.next);
    }
  };

  stop() {
    this.options.play = false;
  }

  play() {
    this.options.play = true;
    this.callback(this.next);
  }

  get mouseX(): number {
    return this.mouse.input.x;
  }

  get mouseY(): number {
    return this.mouse.input.y;
  }
}

// A utility function to draw a rectangle with rounded corners.

function roundedRect(
  g: Graphics2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  g.beginPath();
  g.moveTo(x, y + r);
  g.lineTo(x, y + h - r);
  g.arcTo(x, y + h, x + r, y + h, r);
  g.lineTo(x + w - r, y + h);
  g.arcTo(x + w, y + h, x + w, y + h - r, r);
  g.lineTo(x + w, y + r);
  g.arcTo(x + w, y, x + w - r, y, r);
  g.lineTo(x + r, y);
  g.arcTo(x, y, x, y + r, r);
  g.stroke();
}

function drawHeart(
  g: Graphics2D,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  g.beginPath();
  g.moveTo(75, 40);
  g.bezierCurveTo(75, 37, 70, 25, 50, 25);
  g.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
  g.bezierCurveTo(20, 80, 40, 102, 75, 120);
  g.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
  g.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
  g.bezierCurveTo(85, 25, 75, 37, 75, 40);
  g.fill();
}

function drawMouse(
  g: Graphics2D,
  x: number,
  y: number,
  w: number,
  h: number,
  down: boolean
): void {
  if (!isNaN(x) && !isNaN(y)) {
    // Draw a filled circle with alpha transparency.
    const x0 = x - w / 2;
    const y0 = y - h / 2;
    const r = Math.max(w, h) / 2;

    g.fillStyle = "rgba(0, 0, 200, 0.5)";
    //g.fillRect(x0, y0, w, h);
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2, true);
    g.fill();
    if (down) {
      g.stroke();
    }

    // Draw an aim.
    g.beginPath();
    g.moveTo(x, y0);
    g.lineTo(x, y0 + h);
    g.moveTo(x0, y);
    g.lineTo(x0 + w, y);
    g.stroke(); // Draw the shape by stroking its outline.

    // Quadratric curves example
    const d = 25;
    g.beginPath();
    g.moveTo(x + 2 * d, y - 4 * d);
    g.quadraticCurveTo(x, y - 4 * d, x, y - 2.5 * d);
    g.quadraticCurveTo(x, y - d, x + d, y - d);
    g.quadraticCurveTo(x + d, y - 0.2 * d, x + 0.2 * d, y);
    g.quadraticCurveTo(x + 1.4 * d, y - 0.2 * d, x + 1.6 * d, y - d);
    g.quadraticCurveTo(x + 4 * d, y - d, x + 4 * d, y - 2.5 * d);
    g.quadraticCurveTo(x + 4 * d, y - 4 * d, x + 2 * d, y - 4 * d);
    g.stroke();
  }
}

function drawTest(g: Graphics2D) {
  let i;

  roundedRect(g, 12, 12, 150, 150, 15);
  roundedRect(g, 19, 19, 150, 150, 9);
  roundedRect(g, 53, 53, 49, 33, 10);
  roundedRect(g, 53, 119, 49, 16, 6);
  roundedRect(g, 135, 53, 49, 33, 10);
  roundedRect(g, 135, 119, 25, 49, 10);

  g.beginPath();
  g.arc(37, 37, 13, Math.PI / 7, -Math.PI / 7, false);
  g.lineTo(31, 37);
  g.fill();

  for (i = 0; i < 8; i++) {
    g.fillRect(51 + i * 16, 35, 4, 4);
  }

  for (i = 0; i < 6; i++) {
    g.fillRect(115, 51 + i * 16, 4, 4);
  }

  for (i = 0; i < 8; i++) {
    g.fillRect(51 + i * 16, 99, 4, 4);
  }

  g.beginPath();
  g.moveTo(83, 116);
  g.lineTo(83, 102);
  g.bezierCurveTo(83, 94, 89, 88, 97, 88);
  g.bezierCurveTo(105, 88, 111, 94, 111, 102);
  g.lineTo(111, 116);
  g.lineTo(106.333, 111.333);
  g.lineTo(101.666, 116);
  g.lineTo(97, 111.333);
  g.lineTo(92.333, 116);
  g.lineTo(87.666, 111.333);
  g.lineTo(83, 116);
  g.fill();

  g.fillStyle = "white";
  g.beginPath();
  g.moveTo(91, 96);
  g.bezierCurveTo(88, 96, 87, 99, 87, 101);
  g.bezierCurveTo(87, 103, 88, 106, 91, 106);
  g.bezierCurveTo(94, 106, 95, 103, 95, 101);
  g.bezierCurveTo(95, 99, 94, 96, 91, 96);
  g.moveTo(103, 96);
  g.bezierCurveTo(100, 96, 99, 99, 99, 101);
  g.bezierCurveTo(99, 103, 100, 106, 103, 106);
  g.bezierCurveTo(106, 106, 107, 103, 107, 101);
  g.bezierCurveTo(107, 99, 106, 96, 103, 96);
  g.fill();

  g.fillStyle = "black";
  g.beginPath();
  g.arc(101, 102, 2, 0, Math.PI * 2, true);
  g.fill();

  g.beginPath();
  g.arc(89, 102, 2, 0, Math.PI * 2, true);
  g.fill();
}

function drawTestGrid(
  g: Graphics2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const cx = w / 2;
  const cy = h / 2;

  g.save();
  g.translate(x, y);

  // set transparency value
  g.globalAlpha = 0.5;

  // draw background
  g.fillStyle = "#FD0";
  g.fillRect(0, 0, cx, cy);
  g.fillStyle = "#6C0";
  g.fillRect(cx, 0, cx, cy);
  g.fillStyle = "#09F";
  g.fillRect(0, cy, cx, cy);
  g.fillStyle = "#F30";
  g.fillRect(cx, cy, cx, cy);
  g.fillStyle = "#FFF";

  // Draw semi transparent circles
  const n = 7;
  const r = Math.floor(Math.min(cx, cy) / 7);
  for (var i = 0; i < n; i++) {
    g.beginPath();
    g.arc(cx, cy, r + r * i, 0, Math.PI * 2, true);
    g.fill();
  }

  g.restore();
}

function drawSceen(time: number, app: CanvasApp): void {
  const g = app.graphics;
  const w = app.options.width;
  const h = app.options.height;

  // Clear the specified rectangular area, making it fully transparent.
  g.clearRect(0, 0, w, h);
  drawTestGrid(g, app.mouseX, app.mouseY, 100, 100);

  if (app.options.play) {
    drawMouse(
      g,
      app.mouseX,
      app.mouseY,
      12 * 2,
      12 * 2,
      app.mouse.input.down && app.mouse.input.button === 0
    );
  } else {
    drawTest(g);
    //drawHeart(g, 0, 0, 40, 40);
  }
}

@Component({
  selector: "app-freecell-game",
  templateUrl: "./freecell-game.component.html",
  styleUrls: ["./freecell-game.component.css"]
})
export class FreecellGameComponent
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  @ViewChild("canvas")
  canvasRef: ElementRef<HTMLCanvasElement>;

  readonly width = 800;
  readonly height = 600;

  app: CanvasApp = null;

  constructor() {}

  appInit(): void {
    this.app = new CanvasApp(this.canvasRef.nativeElement, { fps: true });

    this.app.keyboard.target = window;
    this.app.mouse.target = this.app.canvas;

    const map = this.app.keyboard.mapping;
    // Add Arrows:
    map.Down = map.ArrowDown = "down";
    map.Up = map.ArrowUp = "up";
    map.Left = map.ArrowLeft = "left";
    map.Right = map.ArrowRight = "right";
    map.Enter = "play";
    map.Esc = map.Escape = "stop";

    this.app.paint = drawSceen;
    this.app.options.ready = true;

    this.app.play();
  }

  ngOnInit(): void {
    console.log("ngOnInit", this.canvasRef.nativeElement);
  }

  ngAfterContentInit(): void {
    console.log("ngAfterContentInit", this.canvasRef.nativeElement);
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit", this.canvasRef.nativeElement);

    setTimeout(() => {
      this.appInit();
    });
  }

  // Called just before Angular destroys the directive/component.
  // Unsubscribe Observables and detach event handlers to avoid memory leaks.
  ngOnDestroy(): void {
    this.app.stop();

    this.app.keyboard.target = null;
    this.app.mouse.target = null;
  }
}
