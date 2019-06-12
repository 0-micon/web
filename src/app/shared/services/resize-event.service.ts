import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResizeEventService {


  constructor() {
    const o = fromEvent(window, 'resize');
   }
}
