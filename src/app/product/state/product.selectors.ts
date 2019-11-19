import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './product.reducer';

export const product = createFeatureSelector<ProductState>('product');

export const showProductCode = createSelector(
  product,
  state => state.showProductCode
);

export const currentProductId = createSelector(
  product,
  state => state.currentProductId
);

export const currentProduct = createSelector(
  product,
  currentProductId,
  (state, id) => {
    if (id === 0) {
      return {
        id: 0,
        productName: null,
        productCode: null,
        releaseDate: null,
        price: null,
        description: null,
        starRating: null,
        imageUrl: null,
        tags: []
      };
    } else if (id > 0) {
      return state.products.find(p => p.id === id);
    }
    return null;
  }
);

export const products = createSelector(
  product,
  state => state.products
);

export const loadError = createSelector(
  product,
  state => state.loadError
);
