import { EventListener } from "./event-listener";

export interface IMouse {
  x: number;
  y: number;
  buttons: number; // all pressed buttons

  // true if the key is down:
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
}

// const isTouchSupported = "ontouchstart" in window;

export class MouseListener extends EventListener {
  input: IMouse = { x: NaN, y: NaN, buttons: 0 };

  update(event: MouseEvent) {
    const input = this.input;

    input.x = event.offsetX;
    input.y = event.offsetY;

    input.buttons = event.buttons;

    input.altKey = event.altKey;
    input.ctrlKey = event.ctrlKey;
    input.shiftKey = event.shiftKey;
  }

  // Event Listeners:
  move = (event: MouseEvent) => {
    this.update(event);
  };

  down = (event: MouseEvent) => {
    this.update(event);
  };

  up = (event: MouseEvent) => {
    this.update(event);
  };

  leave = (event: MouseEvent) => {
    const input = this.input;

    input.x = input.y = NaN;
    input.buttons = 0;

    input.altKey = false;
    input.ctrlKey = false;
    input.shiftKey = false;
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

  // extractCoords(event: MouseEvent) {
  //   // for webkit browser like safari and chrome
  //   if (event.offsetX || event.offsetX === 0) {
  //     this.input.x = event.offsetX;
  //     this.input.y = event.offsetY;
  //   }
  //   // for mozilla firefox
  //   else if (event.layerX || event.layerX === 0) {
  //     this.input.x = event.layerX;
  //     this.input.y = event.layerY;
  //   } else if (this.target instanceof Element) {
  //     const rect = this.target.getBoundingClientRect();
  //     this.input.x = Math.floor(event.clientX - rect.left);
  //     this.input.y = Math.floor(event.clientY - rect.top);
  //   }
  //   // for touch devices
  //   else if (isTouchSupported && this.target instanceof HTMLElement) {
  //     this.input.x = event.clientX - this.target.offsetLeft;
  //     this.input.y = event.clientY - this.target.offsetTop;
  //   }
  // }
}
