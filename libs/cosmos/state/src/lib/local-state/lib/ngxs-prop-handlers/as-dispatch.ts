import { Injector } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { definePropHandlerFactory, PropHandler } from '../prop-handler';

export interface ActionDef<TArgs extends any[], TReturn> {
  type: string;
  new (...args: TArgs): TReturn;
}

function createDispatchPropHandler<TArgs extends any[], TReturn>(
  actionType: ActionDef<TArgs, TReturn>
): PropHandler<(...args: TArgs) => Observable<void>> {
  type PropValueType = (...args: TArgs) => Observable<void>;

  let key: string | symbol;
  let propName = 'UKNOWN';
  let injector: Injector;
  let dispatchFn: PropValueType;

  function createDispatchFn(): PropValueType {
    const store = injector.get(Store);
    return (...args: TArgs) => {
      const action = new actionType(...args);
      return store.dispatch(action);
    };
  }

  const propHandler: PropHandler<PropValueType> = {
    init(metadata): void {
      key = metadata.prop;
      injector = metadata.injector;
      propName = key.toString();
    },
    get(): PropValueType {
      return dispatchFn || (dispatchFn = createDispatchFn());
    },
    set(value: PropValueType): boolean {
      if (ngDevMode) {
        throw new Error(
          `'${propName}' is a Dispatch Local State property. It cannot be altered.`
        );
      }

      return false;
    },
  };
  return propHandler;
}

export const asDispatch = definePropHandlerFactory(createDispatchPropHandler);
