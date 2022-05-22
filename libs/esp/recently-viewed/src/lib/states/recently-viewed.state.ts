import { Injectable } from '@angular/core';
import type { StateContext } from '@ngxs/store';
import { Action, Selector, State, StateOperator } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { AddEntity } from '../actions/_internal.actions';
import { RecentlyViewedStateModel, RecentlyViewedTypes } from './model';

type ThisStateModel = RecentlyViewedStateModel;
type ThisStateContext = StateContext<ThisStateModel>;

@State<ThisStateModel>({
  name: 'recentlyViewed',
  defaults: {
    companies: [],
    orders: [],
    products: [],
    suppliers: [],
    tasks: [],
  },
})
@Injectable()
export class RecentlyViewedState {
  static readonly MAX_ENTITIES = 20;

  @Selector()
  static getRecentlyViewed(state: ThisStateModel) {
    return state;
  }

  constructor() {}

  @Action(AddEntity)
  addEntity<T extends RecentlyViewedTypes>(
    ctx: ThisStateContext,
    action: AddEntity<T>
  ) {
    ctx.setState(
      patch<ThisStateModel>({
        [action.entityType]: insertRecent(action.recentEntity),
      })
    );
  }
}

function insertRecent<T extends { Id?: any }>(entity: T): StateOperator<T[]> {
  return (state: T[]): T[] => {
    if (!entity.Id) return state;
    // Only add if entity doesn't exist in array
    const index = state.findIndex((item) => item.Id === entity.Id);
    if (index >= 0) return state;

    const entityArr = [entity, ...(state || [])];
    return entityArr.slice(0, RecentlyViewedState.MAX_ENTITIES);
  };
}
