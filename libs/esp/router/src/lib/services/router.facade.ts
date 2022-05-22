import { Injectable } from '@angular/core';
import { RouterSelectors } from '../store';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root',
})
export class RouterFacade {
  constructor(private store: Store) {}

  data$ = this.store.select(RouterSelectors.data);
  params$ = this.store.select(RouterSelectors.params);
  queryParams$ = this.store.select(RouterSelectors.queryParams);
  url$ = this.store.select(RouterSelectors.url);
}
