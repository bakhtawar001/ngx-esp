import { Injectable } from '@angular/core';
import { asDispatch, fromSelector } from '@cosmos/state';
import { SearchCriteria } from '@esp/models';
import { SearchLocalState } from '@esp/search';
import { OrdersSearchActions, OrdersSearchQueries } from '@esp/orders';

@Injectable()
export class SelectOrderDialogSearchLocalState extends SearchLocalState<SelectOrderDialogSearchLocalState> {
  static readonly maxCount: number = 11;
  static readonly sortValue: Record<string, string> = {
    UpdateDate: 'desc',
  };

  createOrder = asDispatch(OrdersSearchActions.CreateOrder);

  readonly loading = fromSelector(OrdersSearchQueries.isLoading);
  readonly criteria = fromSelector(OrdersSearchQueries.getCriteria);
  readonly orders = fromSelector(OrdersSearchQueries.getHits);
  readonly creatingOrder = fromSelector(OrdersSearchQueries.creatingOrder);

  total = fromSelector(OrdersSearchQueries.getTotal);
  override term = '';
  from = 1;

  private _search = asDispatch(OrdersSearchActions.Search);

  search({ term, editOnly = true }: SearchCriteria): void {
    this._search({
      term,
      editOnly,
      from: 1,
      size: SelectOrderDialogSearchLocalState.maxCount,
    });
  }
}
