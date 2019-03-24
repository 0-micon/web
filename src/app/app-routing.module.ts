import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductGuard } from './guards/product.guard';

import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { ProductEditGuard } from './guards/product-edit.guard';

const routes: Routes = [
  { path: 'customer', component: CustomerFormComponent },
  { path: 'products', component: ProductListComponent },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    canActivate: [ProductGuard]
  },
  {
    path: 'products/:id/edit',
    component: ProductEditComponent,
    canDeactivate: [ProductEditGuard]
  },
  { path: 'welcome', component: WelcomeComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
