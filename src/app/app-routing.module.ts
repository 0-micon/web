import { NgModule, Type } from "@angular/core";
import { Routes, RouterModule, Route } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { WorkoutsComponent } from "./workouts/workouts.component";
import { EntryEditorComponent } from "./entry-editor/entry-editor.component";

const _R_ = (path: string, component?: Type<any>): Route => ({
  path,
  component
});

const routes: Routes = [
  _R_("", HomeComponent),
  _R_("workouts", WorkoutsComponent),
  _R_("workouts/:id", EntryEditorComponent)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
