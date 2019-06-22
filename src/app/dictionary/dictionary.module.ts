import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { AddDictionaryComponent } from './add-dictionary/add-dictionary.component';
import { UploadDictionaryFileComponent } from './upload-dictionary-file/upload-dictionary-file.component';
import { PreviewDictionaryComponent } from './preview-dictionary/preview-dictionary.component';
import { AddDictionaryToDbComponent } from './add-dictionary-to-db/add-dictionary-to-db.component';
import { BookshelfComponent } from './bookshelf/bookshelf.component';
import { DictionarySearchComponent } from './dictionary-search/dictionary-search.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddDictionaryComponent
  },
  {
    path: 'shelf',
    component: BookshelfComponent
  },
  { path: '**', redirectTo: 'shelf' }
];

@NgModule({
  imports: [CommonModule, FormsModule, SharedModule, RouterModule.forChild(routes)],
  declarations: [
    AddDictionaryComponent,
    UploadDictionaryFileComponent,
    PreviewDictionaryComponent,
    AddDictionaryToDbComponent,
    BookshelfComponent,
    DictionarySearchComponent
  ],
  exports: [AddDictionaryComponent]
})
export class DictionaryModule {}
