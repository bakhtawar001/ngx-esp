import { Injectable } from '@angular/core';
import { asDispatch, fromSelector, LocalState } from '@cosmos/state';
import {
  CollectionProductsQueries,
  CollectionsActions,
  CollectionsQueries,
} from '@esp/collections';

@Injectable()
export class CollectionDetailLocalState extends LocalState<CollectionDetailLocalState> {
  private _delete = asDispatch(CollectionsActions.Delete);

  hasLoaded = fromSelector(CollectionsQueries.hasLoaded);
  isLoading = fromSelector(CollectionsQueries.isLoading);

  canEdit = fromSelector(CollectionsQueries.canEdit);
  collection = fromSelector(CollectionsQueries.getCollection);
  criteria = fromSelector(CollectionsQueries.getCriteria);

  products = fromSelector(CollectionProductsQueries.getProducts);

  save = asDispatch(CollectionsActions.Save);
  saveStatus = asDispatch(CollectionsActions.SaveStatus);
  transferOwner = asDispatch(CollectionsActions.TransferOwner);

  activate() {
    this.saveStatus(this.collection, 'Active');
  }

  archive() {
    this.saveStatus(this.collection, 'Archived');
  }

  delete() {
    this._delete(this.collection);
  }
}
