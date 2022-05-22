import { Injectable } from '@angular/core';
import { Actions, ActionType, ofActionDispatched } from '@ngxs/store';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AlgoliaService {
  constructor(private readonly actions$: Actions) {}

  waitUntilAlgoliaIsSynchronized(type: ActionType) {
    return this.actions$.pipe(ofActionDispatched(type), take(1));
  }
}
