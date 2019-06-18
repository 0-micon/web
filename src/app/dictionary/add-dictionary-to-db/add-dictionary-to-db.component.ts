import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DictionaryDbService } from '../services/dictionary-db.service';

@Component({
  selector: 'app-add-dictionary-to-db',
  templateUrl: './add-dictionary-to-db.component.html',
  styleUrls: ['./add-dictionary-to-db.component.scss']
})
export class AddDictionaryToDbComponent implements OnInit {
  showHelp = false;
  loading = false;
  progress = 0;

  @Input() items: string[][];

  // Dictionary Name.
  @Input() name: string;
  // Additional Information.
  info: string;

  constructor(private _db: DictionaryDbService) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    const name = this.name;
    const data = this.items;
    const info = this.info;

    if (name && data && !this.loading) {
      this.progress = 0;
      this.loading = true;
      this._db.addBookObservable(name, info).subscribe(
        isbn =>
          this._db.addCardsObservable(isbn, data).subscribe(
            progress => (this.progress = progress),
            error => this.onError(error),
            () => {
              // Wait a sec or two to show the full progress bar.
              setTimeout(() => {
                this.loading = false;
              }, 1000);
            }
          ),
        error => this.onError(error)
      );

      // this._db.addBook(
      //   name,
      //   info,
      //   isbn => {
      //     this._db.addCards(
      //       isbn as string,
      //       data,
      //       progress => {
      //         this.progress = progress;
      //         this.loading = progress < 100;
      //       },
      //       error => this.onError(error)
      //     );
      //   },
      //   error => this.onError(error)
      // );
    }
  }

  onError(reason: string) {
    console.warn('Error: ', reason);
    this.loading = false;
  }
}
