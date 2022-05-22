import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { PriceGrid } from '@smartlink/models';
import { EntityStateModel, setEntityStateItem } from '@cosmos/state';

import { PresentationProductsApiService } from '../../api';
import { PresentationProductOriginalPriceGridsActions } from '../../actions';

export interface PresentationProductOriginalPriceGridsStateModel
  extends EntityStateModel<PriceGrid> {}

type LocalStateContext =
  StateContext<PresentationProductOriginalPriceGridsStateModel>;

const defaultState = (): PresentationProductOriginalPriceGridsStateModel => ({
  items: {},
  itemIds: [],
});

@State<PresentationProductOriginalPriceGridsStateModel>({
  name: 'originalPriceGrids',
  defaults: defaultState(),
})
@Injectable()
export class PresentationProductOriginalPriceGridsState {
  constructor(private readonly service: PresentationProductsApiService) {}

  @Action(PresentationProductOriginalPriceGridsActions.Get)
  getOriginalPriceGrid(
    ctx: LocalStateContext,
    action: PresentationProductOriginalPriceGridsActions.Get
  ) {
    return this.service
      .getOriginalPriceGrid(action.productId, action.priceGridId)
      .pipe(
        tap((originalPriceGrid) =>
          ctx.setState(
            setEntityStateItem(action.priceGridId, originalPriceGrid)
          )
        )
      );
  }
}
