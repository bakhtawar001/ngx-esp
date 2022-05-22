import { Injectable } from '@angular/core';
import type { StateContext } from '@ngxs/store';
import { Action, createSelector, State } from '@ngxs/store';
import { SetFolded } from './actions';
import { SidebarStateModel } from './model';

@State<SidebarStateModel>({
  name: 'sidebar',
  defaults: {},
})
@Injectable()
export class SidebarState {
  static getFolded(key: string) {
    return createSelector([SidebarState], (state: SidebarStateModel) => {
      return state[key].folded;
    });
  }

  @Action(SetFolded)
  setFolded(ctx: StateContext<SidebarStateModel>, event: SetFolded) {
    const { folded } = event;

    ctx.patchState({
      [event.key]: { folded },
    });
  }
}
