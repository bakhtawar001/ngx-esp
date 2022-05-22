import { PropHandler } from '../prop-handler';

export function createPropHandlerProxy<T extends object>(
  obj: T,
  getHandler: (prop: string | symbol, receiver: any) => PropHandler<unknown>
): T {
  return new Proxy<T>(obj as unknown as T, {
    get: (target, prop: string | symbol, receiver) => {
      return getHandler(prop, receiver).get();
    },
    set: (target, prop: string | symbol, value, receiver) => {
      return getHandler(prop, receiver).set(value);
    },
    defineProperty(target, prop, attributes): boolean {
      if (ngDevMode) {
        throw new Error(`'defineProperty' is an invalid operation.`);
      }

      return false;
    },
    setPrototypeOf(target, proto): boolean {
      if (ngDevMode) {
        throw new Error(`'setPrototypeOf' is an invalid operation.`);
      }

      return false;
    },
  }) as T;
}
