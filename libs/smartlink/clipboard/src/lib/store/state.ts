import { Injectable } from '@angular/core';
import type { StateContext } from '@ngxs/store';
import { Action, Selector, State } from '@ngxs/store';
import { AddItem, DeleteItem, DeleteItems, SetItems } from './actions';
import { ClipboardStateModel } from './model';

@State<ClipboardStateModel>({
  name: 'clipboard',
  defaults: {
    items: [],
  },
})
@Injectable()
export class ClipboardState {
  @Selector()
  static items(state: ClipboardStateModel) {
    return state.items;
  }

  @Selector()
  static getItemById(state: ClipboardStateModel) {
    return (id: number) => {
      const idx = state.items.findIndex((item) => item.Id === id);

      if (idx >= 0) {
        return state.items[idx];
      } else {
        return undefined;
      }
    };
  }

  @Action(AddItem)
  addItem(ctx: StateContext<ClipboardStateModel>, event: AddItem) {
    const { items } = ctx.getState();

    const updated = [event.item, ...items];

    ctx.patchState({
      items: updated,
    });
  }

  @Action(SetItems)
  setItems(ctx: StateContext<ClipboardStateModel>, event: SetItems) {
    const { items } = event;
    ctx.patchState({ items });
  }

  @Action(DeleteItem)
  deleteItem(ctx: StateContext<ClipboardStateModel>, event: DeleteItem) {
    const { id } = event;
    const { items } = ctx.getState();

    const updated = items.filter((item) => item.Id !== id);

    ctx.patchState({
      items: updated,
    });
  }

  @Action(DeleteItems)
  deleteItems(ctx: StateContext<ClipboardStateModel>, event: DeleteItems) {
    const { ids } = event;
    const { items } = ctx.getState();

    const updated = items.filter((item) => ids.indexOf(item.Id) === -1);

    ctx.patchState({
      items: updated,
    });
  }
}
