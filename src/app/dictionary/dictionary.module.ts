import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MaterialModule } from '../shared/material/material.module';

import { AddDictionaryComponent } from './add-dictionary.component';

const routes: Routes = [
  {
    path: '',
    component: AddDictionaryComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [AddDictionaryComponent],
  imports: [CommonModule, MaterialModule, RouterModule.forChild(routes)],
  exports: [AddDictionaryComponent]
})
export class DictionaryModule {}
