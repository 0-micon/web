import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './product.reducer';

export const product = createFeatureSelector<ProductState>('product');

export const showProductCode = createSelector(
  product,
  state => state.showProductCode
);

export const currentProduct = createSelector(
  product,
  state => state.currentProduct
);

export const products = createSelector(
  product,
  state => state.products
);

export const loadError = createSelector(
  product,
  state => state.loadError
);
