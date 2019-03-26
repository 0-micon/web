import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IProduct } from './product';
import { ProductService } from './product.service';

export interface IResolvedProduct {
  product: IProduct | null;
  error?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ProductResolverService implements Resolve<IResolvedProduct> {
  constructor(private _productService: ProductService) {}

  protected _onError(message: string): Observable<IResolvedProduct> {
    console.error(message);
    return of({ product: null, error: message });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IResolvedProduct> {
    const id = +route.params.id;
    if (isNaN(id)) {
      return this._onError(`Product id was not a number: ${route.params.id}`);
    }
    return this._productService.getProduct(id).pipe(
      map(product => ({ product })),
      catchError(error => this._onError(`Retrieval error: ${error}`))
    );
  }
}
