import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'dict', loadChildren: './dictionary/dictionary.module#DictionaryModule' },
  // { path: 'dict', component: AddDictionaryComponent },
  { path: '**', redirectTo: 'dict' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
