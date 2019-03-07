import { NgModule } from "@angular/core";
import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule
} from "@angular/material";

import { MatSidenavModule } from "@angular/material/sidenav";

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSidenavModule
  ],
  exports: [MatButtonModule, MatCheckboxModule, MatIconModule, MatSidenavModule]
})
export class MaterialModule {}
