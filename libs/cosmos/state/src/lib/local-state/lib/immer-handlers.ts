import produce, { Draft } from 'immer';
import {
  definePropHandlerFactory,
  PropHandler,
  PropMetadata,
} from './prop-handler';
import { StateContainer } from './state-container';
import { StateProps } from './state-context';

export type MutableProps<T> = Draft<StateProps<T>>;

// TODO: Handle the situation where someone does async work in this

function createMutableActionPropertyHandler<T, TArgs extends any[]>(
  handler: (draft: T, ...args: TArgs) => void
): PropHandler<(...args: TArgs) => void> {
  let stateContainer: StateContainer<T>;
  let key: string | symbol;
  let receiver: T;
  let propName = 'UKNOWN';
  const propHandler: PropHandler<(...args: TArgs) => void> = {
    init(metadata: PropMetadata<T>): void {
      key = metadata.prop;
      stateContainer = metadata.stateContainer;
      propName = key.toString();
      receiver = metadata.receiver;
    },
    get(): (...args: TArgs) => void {
      return (...args: TArgs): void => {
        const ctx = stateContainer.createRootStateContext();
        ctx.setState(
          produce<StateProps<T>>((draft) => {
            handler.apply(receiver, [draft as unknown as T, ...args]);
          })
        );
      };
    },
    set(): boolean {
      throw new Error(
        `'${propName}' is a readonly Local State action function.`
      );
    },
  };
  return propHandler;
}

// Marks a function call as pure. That means, it can safely be dropped if `mutableReducer` is not used.
export const mutableReducer = /*@__PURE__*/ definePropHandlerFactory(
  createMutableActionPropertyHandler
);
