import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { IProduct } from '../product';


@Component({
  selector: 'app-product-shell-list',
  templateUrl: './product-shell-list.component.html',
  styleUrls: ['./product-shell-list.component.scss']
})
export class ProductShellListComponent implements OnInit {
  @Input()
  pageTitle: string = 'Products';

  @Input()
  products: IProduct[];

  @Input()
  currentProduct: IProduct;

  @Input()
  displayCode: boolean;

  @Input()
  errorMessage: string;

  @Output()
  setCurrentProduct = new EventEmitter<IProduct>();

  @Output()
  setDisplayCode = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  checkChange(value: boolean): void {
    this.setDisplayCode.emit(value);
  }

  selectProduct(product: IProduct): void {
    this.setCurrentProduct.emit(product);
  }
}
