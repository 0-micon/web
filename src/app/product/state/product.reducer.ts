// import { Action } from '@ngrx/store';
import { ActionTypes, Actions } from './product.actions';
import { IProduct } from '../product';

// States:
export interface ProductState {
  showProductCode: boolean;
  currentProduct: IProduct;
  products: IProduct[];
  loadError: string;
}

const initialState: ProductState = {
  showProductCode: true,
  currentProduct: null,
  products: [],
  loadError: null
};

// Reducers:
export function reducer(
  state: Readonly<ProductState> = initialState,
  action: Actions
): ProductState {
  console.log('State:', state);
  console.log('Action:', action);
  switch (action.type) {
    case ActionTypes.LOAD_PRODUCTS_SUCCESS: {
      let currentProduct = state.currentProduct;
      if (currentProduct) {
        currentProduct = action.payload.find(product => currentProduct.id === product.id);
      }
      return { ...state, products: action.payload, currentProduct, loadError: null };
    }
    case ActionTypes.LOAD_PRODUCTS_FAIL:
      return { ...state, products: [], currentProduct: null, loadError: action.payload };
    case ActionTypes.SHOW_PRODUCT_CODE:
      return { ...state, showProductCode: action.payload };
    case ActionTypes.SET_CURRENT_PRODUCT:
      return { ...state, currentProduct: action.payload };

    default:
      return state;
  }
}
