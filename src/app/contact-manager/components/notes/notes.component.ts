import { Component, OnInit, Input } from '@angular/core';
import { PageEvent, Sort, SortDirection } from '@angular/material';
// import { MatTableDataSource } from "@angular/material";

import { NoteModel } from '../../models/note-model';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  @Input() notes: NoteModel[] = [];

  //  displayedColumns: string[] = ["position", "title", "date"];

  pageIndex: number = 0;
  pageSize: number = 5;

  filter: string = '';

  sortActive: string = '';
  sortDirection: SortDirection = '';

  get filteredNotes(): NoteModel[] {
    let notes = this.notes;
    if (this.filter) {
      notes = notes.filter(
        entry => entry.title.toLowerCase().indexOf(this.filter) >= 0
      );
    }

    const start = this.pageSize * this.pageIndex;
    const end = start + this.pageSize;
    notes = notes.slice(start, end);

    if (this.sortDirection === 'asc') {
      if (this.sortActive === 'id') {
        notes.sort((a, b) => a.id - b.id);
      } else if (this.sortActive === 'title') {
        notes.sort((a, b) => a.title.localeCompare(b.title));
      } else if (this.sortActive === 'date') {
        notes.sort(
          (a, b) =>
            Date.parse(a.date.toString()) - Date.parse(b.date.toString())
        );
      }
    } else if (this.sortDirection === 'desc') {
      if (this.sortActive === 'id') {
        notes.sort((a, b) => b.id - a.id);
      } else if (this.sortActive === 'title') {
        notes.sort((a, b) => b.title.localeCompare(a.title));
      } else if (this.sortActive === 'date') {
        notes.sort(
          (a, b) =>
            Date.parse(b.date.toString()) - Date.parse(a.date.toString())
        );
      }
    }

    return notes;
  }

  constructor() {}

  ngOnInit() {}

  onPageEvent($event: PageEvent): void {
    // console.log("Page Event:", $event);
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
  }

  applyFilter(filter: string) {
    // this.filter = filter.trim().toLowerCase();
    this.filter = filter.toLowerCase();
  }

  sortData($event: Sort) {
    // console.log("Sort Event:", $event);
    this.sortActive = $event.active;
    this.sortDirection = $event.direction;
  }
}
