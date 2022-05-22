import { Injectable } from '@angular/core';
import {
  asDispatch,
  fromSelector,
  routeParameter,
  stateBehavior,
} from '@cosmos/state';
import {
  CollectionProductsActions,
  CollectionProductsQueries,
  CollectionsQueries,
} from '@esp/collections';
import { SearchCriteria } from '@esp/models';
import { SearchPageLocalState } from '@esp/search';
import { animationFrameScheduler, defer } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMapTo,
  tap,
} from 'rxjs/operators';
import { productSortOptions } from '../../configs';
import { syncCollectionsSetting } from '../../utils';

@Injectable()
export class CollectionProductsLocalState extends SearchPageLocalState<CollectionProductsLocalState> {
  private _delete = asDispatch(CollectionProductsActions.Remove);
  private _search = asDispatch(CollectionProductsActions.Search);

  hasLoaded = fromSelector(CollectionProductsQueries.hasLoaded);
  isLoading = fromSelector(CollectionProductsQueries.isLoading);
  getLoadError = fromSelector(CollectionProductsQueries.getLoadError);

  collectionId = routeParameter('id');
  collection = fromSelector(CollectionsQueries.getCollection);
  criteria = fromSelector(CollectionProductsQueries.getCriteria);
  products = fromSelector(CollectionProductsQueries.getProducts);

  override sort = syncCollectionsSetting(
    'collectionProductsSort',
    productSortOptions[0]
  );

  total = fromSelector(CollectionProductsQueries.getTotal);

  canEdit = fromSelector(CollectionsQueries.canEdit);

  private _searchOnCollectionChanges =
    stateBehavior<CollectionProductsLocalState>((state$) =>
      defer(() => Promise.resolve()).pipe(
        switchMapTo(
          state$.pipe(
            map((state) => state.collection?.Id),
            debounceTime(0, animationFrameScheduler),
            distinctUntilChanged(),
            tap(() => this.search(this.criteria))
          )
        )
      )
    );

  search(criteria?: SearchCriteria): void {
    this._search(+this.collectionId, criteria);
  }

  delete(productIds: number[]) {
    if (this.collection) {
      this._delete(this.collection.Id, productIds);
    }
  }

  get pageIndex() {
    return this.criteria.from - 1;
  }
}
