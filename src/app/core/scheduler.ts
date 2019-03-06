export interface IUpdateCallback {
  (time: number): number;
}

export interface IUpdatable {
  update: IUpdateCallback;
}

interface IUpdatableEntry {
  item: IUpdatable;
  time: number;
}

export class Scheduler implements IUpdatable {
  queue: IUpdatableEntry[] = [];

  add(item: IUpdatable, time: number = 0): void {
    const entry: IUpdatableEntry = { item, time };
    const queue = this.queue;
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].time < time) {
        queue.splice(i, 0, entry);
        return;
      }
    }
    queue.push(entry);
  }

  addCallback(callback: IUpdateCallback, time: number = 0): void {
    this.add({ update: callback }, time);
  }

  remove(item: IUpdatable, all?: boolean): void {
    const queue = this.queue;
    for (let i = queue.length; i-- > 0; ) {
      if (queue[i].item === item) {
        queue.splice(i, 1);
        if (!all) {
          break;
        }
      }
    }
  }

  removeCallback(callback: IUpdateCallback, all?: boolean): void {
    const queue = this.queue;
    for (let i = queue.length; i-- > 0; ) {
      if (queue[i].item.update === callback) {
        queue.splice(i, 1);
        if (!all) {
          break;
        }
      }
    }
  }

  update(time: number): number {
    const queue = this.queue;
    let updated: boolean = false;
    for (let i = queue.length; i-- > 0; ) {
      const entry = queue[i];
      if (entry.time <= time) {
        entry.time = entry.item.update(time);
        if (entry.time < 0) {
          // Remove this subscriber.
          queue.splice(i, 1);
        } else {
          updated = true;
        }
      } else {
        break;
      }
    }

    if (updated) {
      // Higher time => lower index.
      queue.sort((a, b) => b.time - a.time);
    }

    // if the queue is empty then ask for the next update in 1/10 of a second,
    // otherwise return the smallest queue time.
    return queue.length > 0 ? queue[queue.length - 1].time : time + 100;
  }
}
