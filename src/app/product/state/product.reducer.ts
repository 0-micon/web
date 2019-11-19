// import { Action } from '@ngrx/store';
import { ActionTypes, Actions } from './product.actions';
import { IProduct } from '../product';

// States:
export interface ProductState {
  showProductCode: boolean;
  currentProductId: number | null;
  products: IProduct[];
  loadError: string;
}

const initialState: ProductState = {
  showProductCode: true,
  currentProductId: null,
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
    case ActionTypes.LOAD_PRODUCTS:
    case ActionTypes.UPDATE_PRODUCT:
      return { ...state, loadError: null };
    case ActionTypes.LOAD_PRODUCTS_SUCCESS:
      return { ...state, products: action.payload, loadError: null };
    case ActionTypes.LOAD_PRODUCTS_FAIL:
      return { ...state, products: [], currentProductId: null, loadError: action.payload };
    case ActionTypes.UPDATE_PRODUCT_SUCCESS: {
      const products: IProduct[] = (state.products || []).slice();
      const i = products.findIndex(p => p.id === action.payload.id);
      if (i >= 0) {
        products[i] = action.payload;
      } else {
        products.push(action.payload);
      }
      return {
        ...state,
        products,
        loadError: null
      };
    }
    case ActionTypes.UPDATE_PRODUCT_FAIL:
      return { ...state, loadError: action.payload };
    case ActionTypes.SHOW_PRODUCT_CODE:
      return { ...state, showProductCode: action.payload };
    case ActionTypes.SET_CURRENT_PRODUCT:
      return { ...state, currentProductId: action.payload ? action.payload.id : null };
    case ActionTypes.SET_CURRENT_PRODUCT_ID:
      return { ...state, currentProductId: action.payload };

    default:
      return state;
  }
}
