import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MultiButtonComponent } from './shared/components/multi-button/multi-button.component';
import { MultiButtonToolbarComponent } from './shared/components/multi-button-toolbar/multi-button-toolbar.component';
import { SaveScrollTopDirective } from './shared/directives/save-scroll-top.directive';
import { DropdownInputComponent } from './shared/components/dropdown-input/dropdown-input.component';

@NgModule({
  declarations: [
    AppComponent,
    MultiButtonComponent,
    MultiButtonToolbarComponent,
    SaveScrollTopDirective,
    DropdownInputComponent
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
