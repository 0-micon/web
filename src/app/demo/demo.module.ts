import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

import { MaterialModule } from "../shared/material.module";

import { DemoRoutingModule } from "./demo-routing.module";
import { ButtonsComponent } from "./buttons/buttons.component";
import { FlexboxComponent } from './flexbox/flexbox.component';

@NgModule({
  declarations: [ButtonsComponent, FlexboxComponent],
  imports: [
    CommonModule,
    DemoRoutingModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule
  ]
})
export class DemoModule {}
