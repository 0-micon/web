import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AddDictionaryComponent } from './add-dictionary/add-dictionary.component';

const routes: Routes = [
  {
    path: '',
    component: AddDictionaryComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [AddDictionaryComponent],
  imports: [CommonModule, NgbModule, RouterModule.forChild(routes)]
})
export class DictionaryModule {}
