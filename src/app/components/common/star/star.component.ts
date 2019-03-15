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
  starWidth: number = 0;

  @Output()
  notify: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(_changes: SimpleChanges): void {
    this.starWidth = (this.rating * 75) / 5;
  }

  onClick(): void {
    this.notify.emit('click');
  }
}
