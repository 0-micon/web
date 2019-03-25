import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss']
})
export class StarComponent implements OnInit, OnChanges {
  @Input()
  rating: number = 0;
  @Input()
  starNum: number = 5;

  @Output()
  notify: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(_changes: SimpleChanges): void {}

  onClick(): void {
    this.notify.emit('click');
  }
}
