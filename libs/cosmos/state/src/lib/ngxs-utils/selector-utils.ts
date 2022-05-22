// From: https://gist.github.com/Carniatto/0e677ec9b43f949c07538e4c69e1f9ce
/* Just copy this file to your project and start experimenting */
import { createSelector } from '@ngxs/store';
import { SelectorDef, TypedSelector } from './selector-types.util';

export type PropertySelectors<TModel> = {
  [P in keyof NonNullable<TModel>]-?: (
    model: TModel
  ) => TModel extends null | undefined ? undefined : NonNullable<TModel>[P];
};

export function createPropertySelectors<TModel>(
  state: SelectorDef<TModel>
): PropertySelectors<TModel> {
  const cache: Partial<PropertySelectors<TModel>> = {};
  return new Proxy<PropertySelectors<TModel>>(
    {} as unknown as PropertySelectors<TModel>,
    {
      get(target: any, prop: keyof TModel) {
        const selector =
          cache[prop] ||
          (createSelector(
            [state],
            (s: TModel) => s?.[prop]
          ) as PropertySelectors<TModel>[typeof prop]);
        cache[prop] = selector;
        return selector;
      },
    } as ProxyHandler<PropertySelectors<TModel>>
  );
}

interface SelectorMap {
  [key: string]: TypedSelector<any>;
}

type MappedSelector<T extends SelectorMap> = (
  ...args: any[]
) => MappedResult<T>;

type MappedResult<TSelectorMap> = {
  [P in keyof TSelectorMap]: TSelectorMap[P] extends TypedSelector<infer R>
    ? R
    : never;
};

export function createMappedSelector<T extends SelectorMap>(
  selectorMap: T
): MappedSelector<T> {
  const selectors = Object.values(selectorMap);
  const selectorKeys = Object.keys(selectorMap);
  return createSelector(selectors, (...args) => {
    return selectorKeys.reduce((obj, key, index) => {
      (obj as any)[key] = args[index];
      return obj;
    }, {} as MappedResult<T>);
  }) as MappedSelector<T>;
}

type KeysToValues<T, Keys extends (keyof T)[]> = {
  [Index in keyof Keys]: Keys[Index] extends keyof T ? T[Keys[Index]] : never;
};

export function createPickSelector<TModel, Keys extends (keyof TModel)[]>(
  state: SelectorDef<TModel>,
  keys: [...Keys]
) {
  const selectors = keys.map((key) =>
    createSelector([state], (s: TModel) => s[key])
  );
  return createSelector(
    [...selectors],
    (...props: KeysToValues<TModel, Keys>) => {
      return keys.reduce((acc, key, index) => {
        acc[key] = props[index];
        return acc;
      }, {} as Pick<TModel, Keys[number]>);
    }
  );
}
