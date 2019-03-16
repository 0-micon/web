import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { IProduct } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl = 'api/products.json';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.productUrl).pipe(
      tap(data => {
        console.log('Data:', data);
      }),
      catchError(this.handleError)
    );
  }

  getProduct(id: number): Observable<IProduct> {
    return this.getProducts().pipe(
      map<IProduct[], IProduct>(data =>
// tslint:disable-next-line: triple-equals
        data.find(product => product.productId == id)
      )
    );
  }

  protected handleError(errorResponse: HttpErrorResponse) {
    let message = '';
    if (errorResponse.error instanceof ErrorEvent) {
      message = `An error occurred: ${errorResponse.error.message}`;
    } else {
      message = `Server returned code: ${
        errorResponse.status
      }, error message is: ${errorResponse.message}`;
    }
    console.error(message);
    return throwError(message);
  }
}
