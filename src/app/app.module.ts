import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ReplacePipe } from './share/pipes/replace.pipe';
import { MarkerComponent } from './components/common/marker/marker.component';
import { StarComponent } from './components/common/star/star.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ReplacePipe,
    MarkerComponent,
    StarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
