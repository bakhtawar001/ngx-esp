import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CollectionsActions } from '../actions';
import { CollectionsQueries } from '../queries';

@Injectable({
  providedIn: 'root',
})
export class CollectionExistsGuards implements CanActivate {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot) {
    return this.hasItem(+route.params.id);
  }

  hasItem(id: number): Observable<boolean> {
    return this.store.dispatch(new CollectionsActions.Get(id)).pipe(
      switchMap(() => this.store.selectOnce(CollectionsQueries.getCollection)),
      map((collection) => collection?.Id === id),
      catchError(() => of(false))
    );
  }
}
