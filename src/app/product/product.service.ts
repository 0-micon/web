import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { IProduct } from './product';

const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
const productUrl = 'http://localhost:3000/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(productUrl).pipe(
      tap(data => {
        console.log('Get All Products:', data);
      }),
      catchError(this.handleError)
    );
  }

  getProduct(id: number): Observable<IProduct> {
    if (id <= 0) {
      return of(this.newProduct());
    }
    return this.http.get<IProduct>(`${productUrl}/${id}`).pipe(
      tap(data => console.log('Get Product:', data)),
      catchError(this.handleError)
    );
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    if (product.id <= 0) {
      return this.createProduct(product);
    }
    return this.http.put<IProduct>(`${productUrl}/${product.id}`, product, { headers }).pipe(
      tap(() => console.log('Update Product:', product.id)),
      // Return the product on an update
      map(() => product),
      catchError(this.handleError)
    );
  }

  createProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(productUrl, { ...product, id: null }, { headers }).pipe(
      tap(data => console.log('Create Product:', data)),
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<{}> {
    return this.http.delete<IProduct>(`${productUrl}/${id}`, { headers }).pipe(
      tap(() => console.log('Delete Product:', id)),
      catchError(this.handleError)
    );
  }

  newProduct(): IProduct {
    return {
      id: 0,
      productName: null,
      productCode: null,
      releaseDate: null,
      price: null,
      description: null,
      starRating: null,
      imageUrl: null,
      tags: []
    };
  }

  protected handleError(errorResponse: HttpErrorResponse) {
    let message = '';
    if (errorResponse.error instanceof ErrorEvent) {
      message = `An error occurred: ${errorResponse.error.message}`;
    } else {
      message = `Server returned code: ${errorResponse.status}, error message is: ${
        errorResponse.message
      }`;
    }
    console.error(message);
    return throwError(message);
  }
}
