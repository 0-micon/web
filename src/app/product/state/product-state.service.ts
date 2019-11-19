import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs';

import { IProduct } from '../product';
import { ProductState } from './product.reducer';
import * as Selectors from './product.selectors';
import { Actions } from './product.actions';

@Injectable({
  providedIn: 'root'
})
export class ProductStateService {
  readonly products$: Observable<IProduct[]>;
  readonly selectedProduct$: Observable<IProduct>;
  readonly errorMessage$: Observable<string>;
  readonly displayCode$: Observable<boolean>;

  constructor(private _store: Store<ProductState>) {
    this.products$ = this._store.pipe(select(Selectors.products));
    this.selectedProduct$ = this._store.pipe(select(Selectors.currentProduct));
    this.errorMessage$ = this._store.pipe(select(Selectors.loadError));
    this.displayCode$ = this._store.pipe(select(Selectors.showProductCode));
  }

  loadProducts(): void {
    this._store.dispatch(Actions.loadProducts());
  }

  selectProduct(product: IProduct): void {
    this._store.dispatch(Actions.setCurrentProduct(product));
  }

  updateProduct(product: IProduct): void {
    this._store.dispatch(Actions.updateProduct(product));
  }

  showProductCode(value: boolean): void {
    this._store.dispatch(Actions.showProductCode(value));
  }
}
