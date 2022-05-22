import { Injectable } from '@angular/core';
import { fromSelector, LocalState } from '@cosmos/state';
import {
  CurrentOrderViewModelQueries,
  EditLineItemViewModelQueries,
} from '../queries';

@Injectable()
export class EditLineItemLocalState extends LocalState<EditLineItemLocalState> {
  isLoading = fromSelector(CurrentOrderViewModelQueries.isFirstTimeLoading);

  lineItem = fromSelector(EditLineItemViewModelQueries.getLineItemViewModel);
}
