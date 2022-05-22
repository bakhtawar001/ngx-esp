import { Injector } from '@angular/core';
import {
  definePropHandlerFactory,
  PropHandler,
  StatePropContext,
} from '@cosmos/state';
import { Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';
import { AppSettingsActions } from '../actions';
import { AppSettingsQueries } from '../queries';

export function createAppSettingsPropHandlerFor<
  TFeatureSettingType extends object
>(featureSettingName: string) {
  return <TKey extends keyof TFeatureSettingType>(
    prop: TKey,
    fallbackValue?: TFeatureSettingType[TKey]
  ) =>
    syncAppSetting<TFeatureSettingType, TKey>(
      featureSettingName,
      prop,
      fallbackValue
    );
}

const syncAppSetting = definePropHandlerFactory(createAppSettingPropHandler);

function createAppSettingPropHandler<
  TFeatureSettingType extends object,
  TKey extends keyof TFeatureSettingType
>(
  featureSettingName: string,
  prop: TKey,
  fallbackValue?: TFeatureSettingType[TKey]
): PropHandler<Readonly<TFeatureSettingType[TKey] | undefined>> {
  type PropValueType = TFeatureSettingType[TKey];

  let key: string | symbol;
  let propName = 'UKNOWN';
  let injector: Injector;

  let store: Store;
  let propCtx: StatePropContext<PropValueType | undefined>;
  let latestValue: PropValueType | undefined = fallbackValue;

  const propHandler: PropHandler<PropValueType | undefined> = {
    init(metadata): void {
      key = metadata.prop;
      injector = metadata.injector;
      const stateContainer = metadata.stateContainer;
      propName = key.toString();

      store = injector.get(Store);
      propCtx = stateContainer.createPropStateContext(key);

      store
        .select(
          AppSettingsQueries.getAppFeatureSettingPropValueFor<
            TFeatureSettingType,
            TKey
          >(featureSettingName, prop)
        )
        .pipe(takeUntil(metadata.destroyed$))
        .subscribe({
          next: (value) => {
            latestValue = typeof value === 'undefined' ? fallbackValue : value;
            propCtx.setState(() => latestValue);
          },
        });
    },
    get(): PropValueType | undefined {
      return latestValue;
    },
    set(value: PropValueType): boolean {
      const action = new AppSettingsActions.SetValue(
        featureSettingName,
        prop,
        value
      );
      store.dispatch(action);
      return true;
    },
  };
  return propHandler;
}
