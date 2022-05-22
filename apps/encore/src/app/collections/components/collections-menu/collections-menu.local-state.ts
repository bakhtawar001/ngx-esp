import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { asDispatch, fromSelector, LocalState } from '@cosmos/state';
import {
  RecentCollectionsActions,
  RecentCollectionsQueries,
} from '@esp/collections';

@Injectable()
export class CollectionsMenuLocalState extends LocalState<CollectionsMenuLocalState> {
  collections = fromSelector(RecentCollectionsQueries.getRecents);
  form = this.createForm();

  search = asDispatch(RecentCollectionsActions.Search);

  constructor(private readonly _fb: FormBuilder) {
    super();
  }

  get hasCollections() {
    return this.collections?.length || this.searchTerm;
  }

  get searchTerm() {
    return this.form.value.term;
  }

  protected createForm() {
    return this._fb.group({
      term: [''],
      from: 1,
      size: 5,
      sortBy: [''],
      status: ['Active'],
      type: 'default',
      filters: [''],
    });
  }
}
