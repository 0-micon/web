export abstract class EventListener {
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
