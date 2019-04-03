import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IProduct } from '../product';
import { ProductService } from '../product.service';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-product-shell-list',
  templateUrl: './product-shell-list.component.html',
  styleUrls: ['./product-shell-list.component.scss']
})
export class ProductShellListComponent implements OnInit {
  pageTitle: string = 'Products';
  errorMessage: string;
  products: IProduct[];
  displayCode: boolean = false;

  @Output()
  selectedProduct: EventEmitter<IProduct> = new EventEmitter();

  constructor(private _productService: ProductService, private _store: Store<any>) {}

  ngOnInit() {
    this._productService
      .getProducts()
      .subscribe(data => (this.products = data), error => (this.errorMessage = error));

    this._store.pipe(select('product')).subscribe(state => {
      console.log('Receiving', state);
      if (state) {
        this.displayCode = state.showProductCode;
      }
    });
  }

  checkChange(value: boolean): void {
    console.log('Dispatching', value);

    this._store.dispatch({
      type: 'TOGGLE_PRODUCT_CODE',
      payload: value
    });
  }
}
