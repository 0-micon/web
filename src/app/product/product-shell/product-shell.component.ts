import { Component, OnInit } from '@angular/core';
import { ProductStateService } from '../state/product-state.service';

@Component({
  selector: 'app-product-shell',
  templateUrl: './product-shell.component.html',
  styleUrls: ['./product-shell.component.scss']
})
export class ProductShellComponent implements OnInit {
  pageTitle: string = 'Product';
  monthCount: number;

  constructor(public state: ProductStateService) {}

  ngOnInit() {
    this.state.loadProducts();
  }
}
