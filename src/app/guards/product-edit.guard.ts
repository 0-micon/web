import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ProductEditComponent } from '../components/product-edit/product-edit.component';

@Injectable({
  providedIn: 'root'
})
export class ProductEditGuard implements CanDeactivate<ProductEditComponent> {
  canDeactivate(
    component: ProductEditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean {
    if (component.form.dirty) {
      const productName = component.get('productName').value || 'New Product';
      return confirm(`Navigate away and lose all changes to ${productName}?`);
    }
    return true;
  }
}
