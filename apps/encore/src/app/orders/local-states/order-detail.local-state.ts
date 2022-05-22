import { Injectable } from '@angular/core';
import { fromSelector, LocalState } from '@cosmos/state';
import { CurrentOrderViewModelQueries } from '../queries';

@Injectable()
export class OrderDetailLocalState extends LocalState<OrderDetailLocalState> {
  isFirstTimeLoading = fromSelector(
    CurrentOrderViewModelQueries.isFirstTimeLoading
  );

  isReloading = fromSelector(CurrentOrderViewModelQueries.isReloading);

  isLocked = fromSelector(CurrentOrderViewModelQueries.isLocked);

  loadErrorMessage = fromSelector(
    CurrentOrderViewModelQueries.loadErrorMessage
  );

  orderViewModel = fromSelector(
    CurrentOrderViewModelQueries.getCurrentOrderDomainModel
  );

  orders = fromSelector(CurrentOrderViewModelQueries.orders);

  sortedOrders = fromSelector(CurrentOrderViewModelQueries.sortedOrders);
}
