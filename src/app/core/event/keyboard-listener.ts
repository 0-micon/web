import { EventListener } from "./event-listener";

export interface IKeyboard {
  [key: string]: boolean;
}

export interface IKeyboardMap {
  [key: string]: string;
}

export class KeyboardListener extends EventListener {
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
