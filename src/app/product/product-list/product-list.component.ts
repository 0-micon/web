import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/product/product';
import { ProductService } from 'src/app/product/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  markerOn: boolean = false;
  showImage: boolean = false;
  imageWidth: number = 50;
  imageMargin: number = 2;
  listFilter: string = '';
  pageTitle: string = 'Product List';
  products: IProduct[];

  get filteredProducts(): IProduct[] {
    const products = this.products || [];
    const filter = this.listFilter ? this.listFilter.toLowerCase() : '';
    return filter
      ? products.filter(
          item => item.productName.toLowerCase().indexOf(filter) >= 0
        )
      : products;
  }

  trackByProductId(index: number, product: IProduct): number {
    return product.id;
  }

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  onNotyfy($event: string, rating: number): void {
    // console.log('Notified:', $event);
    this.pageTitle = 'Product Rating ' + rating + ' ' + $event;
  }
}
