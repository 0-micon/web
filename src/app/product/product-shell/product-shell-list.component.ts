import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IProduct } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-shell-list',
  templateUrl: './product-shell-list.component.html',
  styleUrls: ['./product-shell-list.component.scss']
})
export class ProductShellListComponent implements OnInit {
  pageTitle: string = 'Products';
  errorMessage: string;
  products: IProduct[];

  @Output()
  selectedProduct: EventEmitter<IProduct> = new EventEmitter();

  constructor(private _productService: ProductService) {}

  ngOnInit() {
    this._productService
      .getProducts()
      .subscribe(data => (this.products = data), error => (this.errorMessage = error));
  }
}
