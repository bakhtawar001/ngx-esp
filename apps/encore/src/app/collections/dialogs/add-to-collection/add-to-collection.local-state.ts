import { Injectable } from '@angular/core';
import { asDispatch, fromSelector, LocalState } from '@cosmos/state';
import {
  CollectionSearchActions,
  CollectionsSearchQueries,
} from '@esp/collections';

@Injectable()
export class AddToCollectionLocalState extends LocalState<AddToCollectionLocalState> {
  collections = fromSelector(CollectionsSearchQueries.getCollections);
  total = fromSelector(CollectionsSearchQueries.getTotal);

  search = asDispatch(CollectionSearchActions.Search);

  reset = asDispatch(CollectionSearchActions.Reset);
}
