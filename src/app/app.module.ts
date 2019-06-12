import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MultiButtonComponent } from './shared/components/multi-button/multi-button.component';
import { MultiButtonToolbarComponent } from './shared/components/multi-button-toolbar/multi-button-toolbar.component';
import { SaveScrollTopDirective } from './shared/directives/save-scroll-top.directive';
import { DropdownInputComponent } from './shared/components/dropdown-input/dropdown-input.component';
import { SimpleVirtualListComponent } from './shared/components/simple-virtual-list/simple-virtual-list.component';

import { XrangePipe } from './shared/pipes/xrange.pipe';

import { NgbExtensionModule } from './shared/ngb-extension/ngb-extension.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MultiButtonComponent,
    MultiButtonToolbarComponent,
    SaveScrollTopDirective,
    DropdownInputComponent,
    SimpleVirtualListComponent,
    XrangePipe
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, NgbExtensionModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
