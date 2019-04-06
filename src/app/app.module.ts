import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { UserModule } from './user/user.module';
import { MessagesModule } from './messages/messages.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { PageNotFoundComponent } from './components/page-not-found.component';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [AppComponent, WelcomeComponent, CustomerFormComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    UserModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
