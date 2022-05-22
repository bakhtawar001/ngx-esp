import { Injectable } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { asDispatch, fromSelector } from '@cosmos/state';
import {
  CollectionSearchActions,
  CollectionsSearchQueries,
} from '@esp/collections';
import { SearchPageLocalState } from '@esp/search';
import { sortOptions } from '../../configs';
import { syncCollectionsSetting } from '../../utils';
import { tabs } from './collection-search.config';

const MaxCount = 1000;
@Injectable()
export class CollectionSearchLocalState extends SearchPageLocalState<CollectionSearchLocalState> {
  criteria = fromSelector(CollectionsSearchQueries.getCriteria);

  collections = fromSelector(CollectionsSearchQueries.getCollections);

  isLoading = fromSelector(CollectionsSearchQueries.isLoading);
  hasLoaded = fromSelector(CollectionsSearchQueries.hasLoaded);

  override sort = syncCollectionsSetting(
    'collectionSearchSort',
    sortOptions[0]
  );
  override tabIndex = syncCollectionsSetting('searchTabIndex', 0);

  _total = fromSelector(CollectionsSearchQueries.getTotal);

  search = asDispatch(CollectionSearchActions.Search);

  override get tab() {
    return tabs[this.tabIndex];
  }

  override setTab(event: MatTabChangeEvent): void {
    this.tabIndex = event.index;
    this.from = 1;
  }

  get total() {
    return Math.min(this._total, MaxCount);
  }
}
