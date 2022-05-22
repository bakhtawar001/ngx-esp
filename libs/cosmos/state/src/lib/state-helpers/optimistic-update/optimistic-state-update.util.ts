import type { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { optimisticUpdate } from './optimistic-update.util';

type PropertiesOfType<TModel extends object, TValue> = {
  [K in keyof TModel]: TModel[K] extends TValue ? K : never;
}[keyof TModel];

export function optimisticStateUpdate<TStateModel extends object, TValue>(
  optimisticValue: TValue,
  stateContext: StateContext<TStateModel>,
  property: PropertiesOfType<TStateModel, TValue>
) {
  return optimisticUpdate(optimisticValue, {
    getValue: () => (stateContext.getState()[property] as unknown) as TValue,
    setValue: (value) => stateContext.setState(patch({ [property]: value })),
  });
}

/* PS. Another potentially convenient API
    ... in the action hook in the state
    return optimisticUpdateXX(updatedContact, ctx, 'contact', {
      serviceCall: this._service.save,
    });
*/
