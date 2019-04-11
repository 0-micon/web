import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Routes, RouterModule } from '@angular/router';

import { MaterialModule } from '../shared/material/material.module';

import { ContactManagerAppComponent } from './contact-manager-app.component';

import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { NotesComponent } from './components/notes/notes.component';
import { NewContactDialogComponent } from './components/new-contact-dialog/new-contact-dialog.component';

import { UserService } from './services/user.service';
import { NavigationService } from './services/navigation.service';
import { HighlighterComponent } from './components/highlighter/highlighter.component';

const routes: Routes = [
  {
    path: '',
    component: ContactManagerAppComponent,
    children: [
      { path: ':id', component: MainContentComponent },
      { path: '', component: MainContentComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    ContactManagerAppComponent,
    ToolbarComponent,
    MainContentComponent,
    SideNavComponent,
    NotesComponent,
    NewContactDialogComponent,
    HighlighterComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  providers: [UserService, NavigationService],
  entryComponents: [NewContactDialogComponent]
})
export class ContactManagerModule {}
