import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { IProduct } from 'src/app/product/product';
import { IResolvedProduct } from '../product-resolver.service';

@Component({
  // selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  pageTitle: string = 'Product Detail';
  errorMessage: string;

  @Input()
  product: IProduct;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const data: IResolvedProduct = this.route.snapshot.data.product;
    this.product = data.product;
    this.errorMessage = data.error;

    // const id = +this.route.snapshot.paramMap.get('id');
    // if (id > 0) {
    //   this.productService
    //     .getProduct(id)
    //     .subscribe(data => (this.product = data));
    // }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
