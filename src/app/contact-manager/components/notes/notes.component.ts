import { Component, OnInit, Input } from "@angular/core";
import { NoteModel } from "../../models/note-model";
import { MatTableDataSource } from "@angular/material";

@Component({
  selector: "app-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.scss"]
})
export class NotesComponent implements OnInit {
  @Input() notes: NoteModel[];

  dataSource: MatTableDataSource<NoteModel>;
  displayedColumns: string[] = ["position", "title", "date"];

  constructor() {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.notes);
  }
}
