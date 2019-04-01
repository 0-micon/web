import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { ShareModule } from '../share/share.module';

import { ProductGuard } from './product.guard';
import { ProductEditGuard } from './product-edit.guard';

import { ProductResolverService } from './product-resolver.service';
import { ProductParamsService } from './product-params.service';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductEditInfoComponent } from './product-edit/product-edit-info.component';
import { ProductEditTagsComponent } from './product-edit/product-edit-tags.component';

@NgModule({
  providers: [ProductResolverService, ProductEditGuard, ProductGuard, ProductParamsService],
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductEditComponent,
    ProductEditInfoComponent,
    ProductEditTagsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,

    ShareModule,
    RouterModule.forChild([
      { path: '', component: ProductListComponent },
      {
        path: ':id',
        component: ProductDetailComponent,
        resolve: { product: ProductResolverService },
        canActivate: [ProductGuard]
      },
      {
        path: ':id/edit',
        component: ProductEditComponent,
        resolve: { product: ProductResolverService },
        canDeactivate: [ProductEditGuard],
        children: [
          { path: '', redirectTo: 'info', pathMatch: 'full' },
          { path: 'info', component: ProductEditInfoComponent },
          { path: 'tags', component: ProductEditTagsComponent }
        ]
      }
    ])
  ]
})
export class ProductModule {}
