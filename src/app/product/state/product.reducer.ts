// import { Action } from '@ngrx/store';
import { ActionTypes, ProductAction } from './product.actions';
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
export function reducer(state: ProductState = initialState, action: ProductAction): ProductState {
  console.log('State:', state);
  console.log('Action:', action);
  switch (action.type) {
    case ActionTypes.products:
    case ActionTypes.LoadProductsSuccess:
      return { ...state, products: action.payload, currentProduct: null, loadError: null };
    case ActionTypes.LoadProductsFail:
      return { ...state, products: [], currentProduct: null, loadError: action.payload };
    case ActionTypes.ShowProductCode:
      return { ...state, showProductCode: action.payload };
    case ActionTypes.SetCurrentProduct:
      return { ...state, currentProduct: action.payload };

    default:
      return state;
  }
}
