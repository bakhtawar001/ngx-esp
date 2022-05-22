import { StateOperator } from '@ngxs/store';
import { iif, isStateOperator, patch } from '@ngxs/store/operators';
import { PatchSpec } from '@ngxs/store/operators/patch';

export function ifNull<T>(
  operatorOrValue: T | StateOperator<T>,
  operatorOrValueIfExists?: T | StateOperator<T>
) {
  return iif<T>((val) => !val, operatorOrValue, operatorOrValueIfExists);
}

export function safePatch<T extends object>(
  patchSpec: PatchSpec<T>
): StateOperator<T> {
  const patcher = patch(patchSpec);
  return function patchSafely(existing: Readonly<T>): T {
    if (typeof existing === 'undefined' || existing === null) {
      existing = {} as Readonly<T>;
    }
    return patcher(existing);
  };
}

export function mergeState<T extends object>(
  mergeSpec: DeepMergeSpec<T>
): StateOperator<T> {
  const patchSpec = convertToPatchSpec<T>(mergeSpec, safePatch);
  const patcher = safePatch<T>(patchSpec);
  return function mergeState(existing: Readonly<T>): T {
    if (typeof existing === 'undefined' || existing === null) {
      existing = {} as Readonly<T>;
    }
    return patcher(existing);
  };

  function convertToPatchSpec<T>(
    spec: DeepMergeSpec<T>,
    innerOp: (propSpec: any) => StateOperator<T>
  ) {
    return Object.fromEntries(
      // @ts-ignore TODO: Mark, please, fix errors here...
      Object.entries(spec).map(([key, value]) => {
        // @ts-ignore TODO: Mark, please, fix errors here...
        const newValue = convertToOperator(value, (innerSpec) => {
          const innerPatchSpec = convertToPatchSpec(innerSpec, innerOp);
          return innerOp(innerPatchSpec);
        });
        return [key, newValue];
      })
    ) as PatchSpec<T>;
  }

  function convertToOperator<T>(
    spec: StateOperator<T> | DeepMergeSpec<T>,
    op: (patchSpec: any) => StateOperator<T>
  ) {
    if (isStateOperator<T>(spec as any)) {
      return spec;
    }
    if (typeof spec === 'object') {
      return op(spec);
    }
    return () => spec;
  }
}

export type DeepMergeSpec<T> = T extends DeepMergePrimitive | DeepMergeNully
  ? T
  : T extends Array<infer V>
  ? DeepMergeArray<V>
  : DeepMergeObject<T>;

type DeepMergePrimitive = boolean | string | number | symbol | bigint;
type DeepMergeNully = undefined | null;
type DeepMergeArray<T> = StateOperator<NonNullable<Array<T>>>;
type DeepMergeObject<T> = {
  readonly [K in keyof T]?:
    | DeepMergeSpec<T[K]>
    | StateOperator<NonNullable<T[K]>>;
};

export function setOrRemoveProp<T extends object, TKey extends keyof T>(
  prop: TKey,
  value: T[TKey]
): StateOperator<Omit<T, TKey>> | StateOperator<T> {
  if (!value) {
    return deleteProp<T, TKey>(prop);
  }
  return safePatch<T>({ [prop]: value } as any);
}

export function deleteProp<T extends object, TKey extends keyof T>(
  prop: TKey
): StateOperator<Omit<T, TKey>> {
  // @ts-ignore TODO: Mark, please, fix errors here...
  return (obj: T) => {
    if (obj && obj.hasOwnProperty(prop)) {
      const { [prop]: removed, ...remaining } = obj;
      return remaining;
    }
    return obj;
  };
}
