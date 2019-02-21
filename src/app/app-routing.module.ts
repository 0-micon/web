import { NgModule, Type } from "@angular/core";
import { Routes, RouterModule, Route } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { WorkoutsComponent } from "./workouts/workouts.component";
import { EntryEditorComponent } from "./entry-editor/entry-editor.component";
import { AdminComponent } from "./admin/admin.component";
import { FreecellHomeComponent } from './freecell/freecell-home.component';
import { FreecellGameComponent } from './freecell/freecell-game.component';

const routes: Routes = [
  { path: "workouts", component: WorkoutsComponent },
  { path: "workouts/:id", component: EntryEditorComponent },
  { path: "freecell", component: FreecellHomeComponent },
  { path: "freecell/:id", component: FreecellGameComponent },
  { path: "admin", component: AdminComponent },
  { path: "", component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
