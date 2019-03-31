import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PageNotFoundComponent } from './components/page-not-found.component';

import { AuthGuard } from './user/auth.guard';
import { SelectiveStrategyService } from './services/selective-strategy.service';

const routes: Routes = [
  { path: 'customer', component: CustomerFormComponent },
  { path: 'welcome', component: WelcomeComponent },
  {
    path: 'products',
    loadChildren: './product/product.module#ProductModule',
    canActivate: [AuthGuard],
    data: { preload: true }
  },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      enableTracing: false,
      preloadingStrategy: SelectiveStrategyService // PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
