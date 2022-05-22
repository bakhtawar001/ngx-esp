import { Injectable } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { asDispatch, fromSelector } from '@cosmos/state';
import {
  PresentationsSearchActions,
  PresentationsSearchQueries,
} from '@esp/presentations';
import { SearchPageLocalState } from '@esp/search';
import {
  presentationTabs,
  sortMenuOptions,
} from './presentation-search.config';

const MaxCount = 1000;
@Injectable()
export class PresentationSearchLocalState extends SearchPageLocalState<PresentationSearchLocalState> {
  criteria = fromSelector(PresentationsSearchQueries.getCriteria);

  presentations = fromSelector(PresentationsSearchQueries.getPresentations);

  isLoading = fromSelector(PresentationsSearchQueries.isLoading);
  hasLoaded = fromSelector(PresentationsSearchQueries.hasLoaded);

  _total = fromSelector(PresentationsSearchQueries.getTotal);

  search = asDispatch(PresentationsSearchActions.Search);

  override sort = sortMenuOptions[0];

  override tabIndex = 0;

  override get tab() {
    return presentationTabs[this.tabIndex];
  }

  override setTab(event: MatTabChangeEvent): void {
    this.tabIndex = event.index;
    this.from = 1;
  }

  get total() {
    return Math.min(this._total, MaxCount);
  }
}
