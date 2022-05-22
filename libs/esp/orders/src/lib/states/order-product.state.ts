import { Injectable } from '@angular/core';
import {
  createPropertySelectors,
  ModelWithLoadingStatus,
  syncLoadProgress,
} from '@cosmos/state';
import { Action, State, StateContext } from '@ngxs/store';
import { Product } from '@smartlink/models';
import { ProductsService } from '@smartlink/products';
import { tap } from 'rxjs/operators';
import { OrderProductActions } from '../actions';

export interface OrderProductStateModel extends ModelWithLoadingStatus {
  product: Product | null;
}

type ThisStateModel = OrderProductStateModel;
type ThisStateContext = StateContext<ThisStateModel>;

@State<ThisStateModel>({
  name: 'orderProduct',
  defaults: {
    loading: null,
    product: null,
  },
})
@Injectable()
export class OrderProductState {
  static readonly props =
    createPropertySelectors<ThisStateModel>(OrderProductState);

  constructor(private readonly _service: ProductsService) {}

  @Action(OrderProductActions.LoadProduct, { cancelUncompleted: true })
  loadProduct(
    ctx: ThisStateContext,
    { productId }: OrderProductActions.LoadProduct
  ) {
    return this._service.get(productId).pipe(
      tap((product) => ctx.patchState({ product })),
      syncLoadProgress(ctx)
    );
  }
}
