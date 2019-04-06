import { Action } from '@ngrx/store';
import { IProduct } from '../product';

export enum ActionTypes {
  ShowProductCode = '[Product] Show product code',
  SetCurrentProduct = '[Product] Select current product',
  LoadProducts = '[Product] Load products',
  LoadProductsSuccess = '[Product] Load products success',
  LoadProductsFail = '[Product] Load products fail',

  products = '[Product] Set product list'
}

export class ShowProductCode implements Action {
  readonly type = ActionTypes.ShowProductCode;
  constructor(public payload: boolean = false) {}
}

export class CurrentProduct implements Action {
  readonly type = ActionTypes.SetCurrentProduct;
  constructor(public payload: IProduct = null) {}
}

export class LoadProducts implements Action {
  readonly type = ActionTypes.LoadProducts;
}

export class LoadProductsSuccess implements Action {
  readonly type = ActionTypes.LoadProductsSuccess;
  constructor(public payload: IProduct[]) {}
}

export class LoadProductsFail implements Action {
  readonly type = ActionTypes.LoadProductsFail;
  constructor(public payload: string) {}
}

export class Products implements Action {
  readonly type = ActionTypes.products;
  constructor(public payload: IProduct[] = []) {}
}

export type ProductAction =
  | ShowProductCode
  | CurrentProduct
  | LoadProducts
  | LoadProductsSuccess
  | LoadProductsFail
  | Products;

// export function isToggleProductCode(action: ProductAction): action is ShowProductCode {
//   return action.type === ActionTypes.ShowProductCode;
// }

// export function isCurrentProduct(action: ProductAction): action is CurrentProduct {
//   return action.type === ActionTypes.SetCurrentProduct;
// }

// export function isProducts(action: ProductAction): action is Products {
//   return action.type === ActionTypes.products;
// }
