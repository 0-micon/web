import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { ProductService } from '../product.service';
import * as ProductActions from './product.actions';

@Injectable()
export class ProductEffects {
  constructor(private _actions$: Actions, private _productService: ProductService) {}

  @Effect()
  loadProducts$ = this._actions$.pipe(
    ofType(ProductActions.ActionTypes.LoadProducts),
    mergeMap((action: ProductActions.LoadProducts) =>
      this._productService.getProducts().pipe(
        map(products => new ProductActions.LoadProductsSuccess(products)),
        catchError(error => of(new ProductActions.LoadProductsFail(error)))
      )
    )
  );
}
