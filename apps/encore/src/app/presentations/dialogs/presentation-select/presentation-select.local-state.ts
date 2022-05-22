import { Injectable } from '@angular/core';
import { asDispatch, fromSelector } from '@cosmos/state';
import { SearchCriteria } from '@esp/models';
import {
  PresentationsSearchActions,
  PresentationsSearchQueries,
} from '@esp/presentations';
import { SearchLocalState } from '@esp/search';

@Injectable()
export class PresentationSelectDialogSearchLocalState extends SearchLocalState<PresentationSelectDialogSearchLocalState> {
  static readonly maxCount: number = 11;
  static readonly sortValue: Record<string, string> = {
    UpdateDate: 'desc',
  };

  presentations = fromSelector(PresentationsSearchQueries.getPresentations);
  total = fromSelector(PresentationsSearchQueries.getTotal);
  criteria = fromSelector(PresentationsSearchQueries.getCriteria);
  loading = fromSelector(PresentationsSearchQueries.isLoading);
  override term = '';
  from = 1;

  private _search = asDispatch(PresentationsSearchActions.Search);

  search({ term, editOnly = true }: SearchCriteria): void {
    this._search({
      term,
      editOnly,
      from: 1,
      size: PresentationSelectDialogSearchLocalState.maxCount,
      status: 'active',
    });
  }
}
