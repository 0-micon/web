import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from 'src/app/product/product';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/product/product.service';

@Component({
  // selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  pageTitle: string = 'Product Detail';
  @Input()
  product: IProduct;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    if (id > 0) {
      this.productService
        .getProduct(id)
        .subscribe(data => (this.product = data));
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
