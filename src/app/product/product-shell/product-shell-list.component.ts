import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IProduct } from '../product';

import { ProductState } from '../state/product.reducer';
import * as StoreActions from '../state/product.actions';
import * as StoreSelectors from '../state/product.selectors';

@Component({
  selector: 'app-product-shell-list',
  templateUrl: './product-shell-list.component.html',
  styleUrls: ['./product-shell-list.component.scss']
})
export class ProductShellListComponent implements OnInit {
  pageTitle: string = 'Products';
  products$: Observable<IProduct[]>;
  selected$: Observable<IProduct>;

  displayCode$: Observable<boolean>;
  errorMessage$: Observable<string>;

  @Output()
  selectedProduct: EventEmitter<IProduct> = new EventEmitter();

  constructor(private _store: Store<ProductState>) {}

  ngOnInit() {
    this.products$ = this._store.pipe(select(StoreSelectors.products));
    this.selected$ = this._store.pipe(select(StoreSelectors.currentProduct));
    this.displayCode$ = this._store.pipe(select(StoreSelectors.showProductCode));
    this.errorMessage$ = this._store.pipe(select(StoreSelectors.loadError));

    this._store.dispatch(new StoreActions.LoadProducts());
  }

  checkChange(value: boolean): void {
    this._store.dispatch(new StoreActions.ShowProductCode(value));
  }

  selectProduct(product: IProduct): void {
    this._store.dispatch(new StoreActions.CurrentProduct(product));
    this.selectedProduct.emit(product);
  }
}
