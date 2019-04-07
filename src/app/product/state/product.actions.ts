import { IProduct } from '../product';
import { createAction, ActionsUnion, OfType } from 'src/app/share/utils/redux.utils';

export enum ActionTypes {
  SHOW_PRODUCT_CODE = '[Product] Show product code',
  SET_CURRENT_PRODUCT = '[Product] Select current product',

  LOAD_PRODUCTS = '[Product] Load products',
  LOAD_PRODUCTS_SUCCESS = '[Product] Load products success',
  LOAD_PRODUCTS_FAIL = '[Product] Load products fail',

  UpdateProduct = '[Product] Update product',
  UpdateProductSuccess = '[Product] Update product success',
  UpdateProductFail = '[Product] Update product fail'
}

export const Actions = {
  showProductCode: (value: boolean) => createAction(ActionTypes.SHOW_PRODUCT_CODE, value),
  setCurrentProduct: (product: IProduct) => createAction(ActionTypes.SET_CURRENT_PRODUCT, product),

  loadProducts: () => createAction(ActionTypes.LOAD_PRODUCTS),
  loadProductsSuccess: (products: IProduct[]) =>
    createAction(ActionTypes.LOAD_PRODUCTS_SUCCESS, products),
  loadProductsFail: (error: string) => createAction(ActionTypes.LOAD_PRODUCTS_FAIL, error)
};

export type Actions = ActionsUnion<typeof Actions>;

type Atype = OfType<Actions, ActionTypes.LOAD_PRODUCTS_SUCCESS>;
type Btype = OfType<Actions, ActionTypes.LOAD_PRODUCTS>;
