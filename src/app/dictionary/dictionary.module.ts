import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MaterialModule } from '../shared/material/material.module';

import { AddDictionaryComponent } from './add-dictionary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DictionaryInputComponent } from './dictionary-input.component';

const routes: Routes = [
  {
    path: '',
    component: AddDictionaryComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [AddDictionaryComponent, DictionaryInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  exports: [AddDictionaryComponent]
})
export class DictionaryModule {}
