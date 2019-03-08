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

  get filteredNotes(): NoteModel[] {
    const start = this.pageSize * this.pageIndex;
    const end = start + this.pageSize;
    return this.notes.slice(start, end);
  }

  constructor() {}

  ngOnInit() {}

  onPageEvent($event: PageEvent): void {
    // console.log("Page Event:", $event);
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
  }
}
