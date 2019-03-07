import { NgModule } from "@angular/core";
import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatListModule
} from "@angular/material";

import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule
  ]
})
export class MaterialModule {}
