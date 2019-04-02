import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from '../product.service';
import { IProduct, Product } from '../product';

@Component({
  selector: 'app-product-shell-info',
  templateUrl: './product-shell-info.component.html',
  styleUrls: ['./product-shell-info.component.scss']
})
export class ProductShellInfoComponent implements OnInit {
  pageTitle: string = 'Product Detail';

  @Input()
  product: IProduct;

  constructor(private _productService: ProductService) {}

  ngOnInit() {}
}
