import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/product/product';
import { ProductService } from 'src/app/product/product.service';
import { ProductParamsService } from '../product-params.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  markerOn: boolean = false;

  imageWidth: number = 50;
  imageMargin: number = 2;
  pageTitle: string = 'Product List';
  products: IProduct[];

  get showImage(): boolean {
    return this._paramsService.showImage;
  }

  set showImage(value: boolean) {
    this._paramsService.showImage = !!value;
  }

  get listFilter(): string {
    return this._paramsService.filterBy;
  }

  set listFilter(value: string) {
    this._paramsService.filterBy = value;
  }

  get filteredProducts(): IProduct[] {
    const products = this.products || [];
    const filter = this.listFilter ? this.listFilter.toLowerCase() : '';
    return filter
      ? products.filter(item => item.productName.toLowerCase().indexOf(filter) >= 0)
      : products;
  }

  trackByProductId(index: number, product: IProduct): number {
    return product.id;
  }

  constructor(
    private _productService: ProductService,
    private _paramsService: ProductParamsService
  ) {}

  ngOnInit() {
    this._productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  onNotyfy($event: string, rating: number): void {
    // console.log('Notified:', $event);
    this.pageTitle = 'Product Rating ' + rating + ' ' + $event;
  }
}
