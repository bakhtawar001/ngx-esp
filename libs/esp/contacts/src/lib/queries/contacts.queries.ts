import {
  createLoadingSelectorsFor,
  createPropertySelectors,
  createSelectorX,
} from '@cosmos/state';
import { ContactsState, ContactsStateModel } from '../states';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ContactsQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<ContactsStateModel>(ContactsState);

  const { items, currentId } =
    createPropertySelectors<ContactsStateModel>(ContactsState);

  export const getContact = createSelectorX(
    [items, currentId],
    (items, currentId) => (currentId && items?.[currentId]) || null
  );

  export const selectedId = createSelectorX(
    [ContactsState],
    (state: ContactsStateModel) => state.items[state.currentId]
  );
}
