import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

  @Output() addBookChange = new EventEmitter<string>();

  constructor(private _db: DictionaryDbService) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    const name = this.name;
    const data = this.items;
    const info = this.info;

    if (name && data && !this.loading) {
      this.progress = 0;
      this.loading = true;
      this._db
        .addBook(name, data, info, progress => (this.progress = progress))
        .then(book => {
          setTimeout(() => {
            this.addBookChange.emit('' + book.id);
          }, 2000);
        })
        .catch(error => this.onError(error))
        .finally(() => {
          // Wait a sec or two to show the full progress bar.
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        });

      // this._db.addBookObservable(name, info).subscribe(
      //   isbn =>
      //     this._db.addCardsObservable(isbn, data).subscribe(
      //       progress => (this.progress = progress),
      //       error => this.onError(error),
      //       () => {
      //         // Wait a sec or two to show the full progress bar.
      //         setTimeout(() => {
      //           this.loading = false;
      //         }, 1000);
      //       }
      //     ),
      //   error => this.onError(error)
      // );

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

  getWord() {
    this._db.addWord('aaa', 999).then(value => console.log('Value:', value));
    // this._db
    //   .getWord('test')
    //   .then(value => console.log('Value:', value))
    //   .catch(error => console.log('Catched error:', error));
  }
}
