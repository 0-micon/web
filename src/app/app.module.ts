import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

// Third party imports:
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { NgbModule, NgbDateAdapter } from "@ng-bootstrap/ng-bootstrap";

// Services:
import { WorkoutsApiService } from "./services/workouts-api.service";
import { DateStringAdapterService } from "./services/date-string-adapter.service";

// Routing:
import { AppRoutingModule } from "./app-routing.module";

// Components:
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { WorkoutsComponent } from "./workouts/workouts.component";
import { EntryEditorComponent } from "./entry-editor/entry-editor.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WorkoutsComponent,
    EntryEditorComponent,
    NavMenuComponent
  ],
  imports: [
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.circleSwish,
      //backdropBackgroundColour: "rgba(0,0,0,0.1)",
      backdropBorderRadius: "14px"
      //primaryColour: "#ffffff",
      //secondaryColour: "#ffffff",
      //tertiaryColour: "#ffffff"
    }),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [
    WorkoutsApiService,
    { provide: NgbDateAdapter, useClass: DateStringAdapterService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
