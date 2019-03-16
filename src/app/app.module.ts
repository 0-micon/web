import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { XrangePipe } from './share/pipes/xrange.pipe';
import { ReplacePipe } from './share/pipes/replace.pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { MarkerComponent } from './components/common/marker/marker.component';
import { StarComponent } from './components/common/star/star.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

@NgModule({
  declarations: [
    ReplacePipe,
    XrangePipe,
    AppComponent,
    ProductListComponent,
    MarkerComponent,
    StarComponent,
    ProductDetailComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    AngularFontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
