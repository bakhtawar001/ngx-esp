import { StateOperator } from '@ngxs/store';
import { compose, insertItem, patch } from '@ngxs/store/operators';
import { safePatch } from '../../ngxs-utils';
import type { EntityStateModel } from './entity-state.model';

export function pruneCache<T extends EntityStateModel>(
  cacheSize: number
): StateOperator<T> {
  return (state: T) => {
    const { items, itemIds: itemIds } = state;

    // Caretaker note: `[...new Set(itemIds)]` requires `downlevelIteration` to be enabled.
    const itemIdsToKeep = Array.from(new Set(itemIds)).slice(0, cacheSize);

    const newItems = itemIdsToKeep.reduce((obj: typeof items, id) => {
      obj[id] = items[id];

      return obj;
    }, {});

    return patch<EntityStateModel<unknown>>({
      items: newItems,
      itemIds: itemIdsToKeep,
    })(state) as T;
  };
}

export interface SetEntityItemStateOptions {
  cacheSize?: number;
}

export function setEntityStateItem<T extends EntityStateModel>(
  id: number,
  item: any,
  options?: SetEntityItemStateOptions
) {
  const operators: Array<StateOperator<T>> = [
    patch({
      items: patch({
        [id]: safePatch(item),
      }),
      itemIds: insertItem(id, 0),
    }),
  ];

  if (typeof options?.cacheSize === 'number') {
    operators.push(pruneCache<T>(options.cacheSize));
  }

  return compose<T>(...operators);
}

export function removeEntityStateItem<T extends EntityStateModel>(id: number) {
  return function removeEntityStateItemOperator(existing: Readonly<T>): T {
    let clone: T | null = null;
    if (existing.items.hasOwnProperty(id)) {
      if (!clone) {
        clone = { ...existing, items: { ...existing.items } };
      }
      delete clone.items[id];
      clone.itemIds = clone.itemIds.filter((itemId) => itemId !== id);
    }
    return clone || existing;
  } as StateOperator<T>;
}
