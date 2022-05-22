import { Injectable } from '@angular/core';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { SetTitle } from './meta.actions';
import { MetaService } from './meta.service';

@State<never>({ name: 'meta' })
@Injectable()
export class MetaState {
  constructor(private meta: MetaService) {}

  @Action(SetTitle)
  setTitle(ctx: StateContext<never>, action: SetTitle): void {
    this.meta.updateTitle(action.title);
  }
}
