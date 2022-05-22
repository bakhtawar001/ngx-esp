import { StateToken } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';
import {
  MetaDataModel,
  SelectorMetaDataModel,
  SharedSelectorOptions,
} from '@ngxs/store/src/internal/internals';

type SelectorOnly<TModel> = StateToken<TModel> | ((...arg: any) => TModel);

export class NgxsSelectorTestBed {
  private stateMap = new Map<string, any>();

  constructor(private rootSelectorOptions?: SharedSelectorOptions) {
    this.rootSelectorOptions = this.rootSelectorOptions || {
      suppressErrors: false,
    };
  }

  setState(stateClass: StateClass<any>, data: any) {
    const metaData: MetaDataModel = (
      stateClass as unknown as { NGXS_META: MetaDataModel }
    ).NGXS_META;
    this.stateMap.set(metaData.name!, data);
    return this;
  }

  getSnapshot<TReturnType>(selector: SelectorOnly<TReturnType>): TReturnType {
    const metaData: SelectorMetaDataModel = (
      selector as unknown as { NGXS_SELECTOR_META: SelectorMetaDataModel }
    ).NGXS_SELECTOR_META;
    const rootSelector = metaData.makeRootSelector!({
      getSelectorOptions: (localOptions) => ({
        ...this.rootSelectorOptions,
        ...localOptions,
      }),
      getStateGetter: (key) => (state) => {
        if (!this.stateMap.has(key)) {
          throw new Error(
            `The selector being tested requires data for a state named '${key}'.`
          );
        }
        return this.stateMap.get(key);
      },
    });
    return rootSelector('Dummy state');
  }
}
