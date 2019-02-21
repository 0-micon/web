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
    if (this.target instanceof Element) {
      // necessary to take into account CSS boundaries
      const rect = this.target.getBoundingClientRect();
      this.input.x = event.clientX - rect.left;
      this.input.y = event.clientY - rect.top;
    } else {
      this.input.x = event.offsetX;
      this.input.y = event.offsetY;
    }
  };

  down = (event: MouseEvent) => {
    this.input.down = true;
    this.input.button = event.button;
  };

  up = (event: MouseEvent) => {
    this.input.down = false;
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
