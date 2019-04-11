import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'contactmanager',
    loadChildren: './contact-manager/contact-manager.module#ContactManagerModule'
  },
  { path: 'demo', loadChildren: './demo/demo.module#DemoModule' },
  { path: 'dict', loadChildren: './dictionary/dictionary.module#DictionaryModule' },
  { path: '**', redirectTo: 'contactmanager' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
