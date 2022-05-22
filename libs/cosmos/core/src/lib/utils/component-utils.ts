import { SimpleChange, SimpleChanges } from '@angular/core';

export function hasChanged<T>(
  change: SimpleChange | ChangedProp<T>
): change is ChangedProp<T> {
  return (
    change &&
    (change.isFirstChange() || change.currentValue !== change.previousValue)
  );
}

export function whenChanged<T, InputKey extends keyof T>(
  component: T,
  inputKey: InputKey,
  simpleChanges: SimpleChanges,
  callback: (
    previousValue: T[InputKey],
    newValue: T[InputKey],
    isFirstChange: boolean
  ) => void
) {
  const simpleChange: SimpleChange = (<any>simpleChanges)[inputKey];
  if (hasChanged<T[InputKey]>(simpleChange)) {
    callback(
      simpleChange.previousValue,
      simpleChange.currentValue,
      simpleChange.firstChange
    );
  }
}

export function whenAnyChanged<T, InputKey extends keyof T>(
  component: T,
  inputKeys: InputKey[],
  simpleChanges: SimpleChanges,
  callback: (isFirstChange: boolean) => void
) {
  const changedProps = inputKeys.map(
    (key) => <ChangedProp<InputKey>>(<any>simpleChanges)[key]
  );
  const hasChanges = changedProps.some(hasChanged);
  const isFirstChange = changedProps.some((prop) => prop.firstChange);
  if (hasChanges) {
    callback(isFirstChange);
  }
}

export interface ChangedProp<T> extends SimpleChange {
  previousValue: T;
  currentValue: T;
}
