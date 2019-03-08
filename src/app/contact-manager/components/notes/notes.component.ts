import { Component, OnInit, Input } from "@angular/core";
import { PageEvent } from "@angular/material";
//import { MatTableDataSource } from "@angular/material";

import { NoteModel } from "../../models/note-model";

@Component({
  selector: "app-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.scss"]
})
export class NotesComponent implements OnInit {
  @Input() notes: NoteModel[] = [];

  displayedColumns: string[] = ["position", "title", "date"];

  pageIndex: number = 0;
  pageSize: number = 5;

  filter: string = "";

  get filteredNotes(): NoteModel[] {
    let notes = this.notes;
    if (this.filter) {
      notes = notes.filter(
        entry => entry.title.toLowerCase().indexOf(this.filter) >= 0
      );
    }

    const start = this.pageSize * this.pageIndex;
    const end = start + this.pageSize;
    return notes.slice(start, end);
  }

  constructor() {}

  ngOnInit() {}

  onPageEvent($event: PageEvent): void {
    // console.log("Page Event:", $event);
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
  }

  applyFilter(filter: string) {
    this.filter = filter.trim().toLowerCase();
  }
}
