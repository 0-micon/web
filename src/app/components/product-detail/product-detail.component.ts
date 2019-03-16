import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from 'src/app/models/product';

@Component({
  // selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  pageTitle: string = 'Product Detail';
  @Input()
  product: IProduct;

  constructor() {}

  ngOnInit() {}
}
