import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { ProductService } from '../product.service';
import { ActionTypes, Actions as ProductActions } from './product.actions';

@Injectable()
export class ProductEffects {
  constructor(private _actions$: Actions, private _productService: ProductService) {}

  @Effect()
  loadProducts$ = this._actions$.pipe(
    ofType(ActionTypes.LOAD_PRODUCTS),
    mergeMap(() =>
      this._productService.getProducts().pipe(
        map(products => ProductActions.loadProductsSuccess(products)),
        catchError(error => of(ProductActions.loadProductsFail(error)))
      )
    )
  );
}
