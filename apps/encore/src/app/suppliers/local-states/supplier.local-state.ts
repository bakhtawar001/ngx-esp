import { Injectable } from '@angular/core';
import { fromSelector, LocalState } from '@cosmos/state';
import { SupplierQueries } from '@smartlink/suppliers';

@Injectable()
export class SupplierLocalState extends LocalState<SupplierLocalState> {
  supplier = fromSelector(SupplierQueries.getSupplier);
  ratings = fromSelector(SupplierQueries.getRatings);
}
