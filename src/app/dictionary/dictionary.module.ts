import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AddDictionaryComponent } from './add-dictionary/add-dictionary.component';
import { UploadDictionaryFileComponent } from './upload-dictionary-file/upload-dictionary-file.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AddDictionaryComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [AddDictionaryComponent, UploadDictionaryFileComponent],
  imports: [CommonModule, FormsModule, SharedModule, RouterModule.forChild(routes)]
})
export class DictionaryModule {}
