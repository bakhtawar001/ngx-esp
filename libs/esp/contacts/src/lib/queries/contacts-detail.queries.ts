import { createPropertySelectors } from '@cosmos/state';
import { createSelector } from '@ngxs/store';
import { ContactsState, ContactsStateModel } from '../states';
import { sortBy } from 'lodash-es';

export namespace ContactsDetailQueries {
  const { items, currentId } =
    createPropertySelectors<ContactsStateModel>(ContactsState);

  export const getContact = createSelector(
    [items, currentId],
    (items, currentId) => {
      if (!currentId || !items?.[currentId]) {
        return null;
      }

      const result = { ...items[currentId] };
      const emails = items[currentId].Emails || [];

      result.Emails = sortBy(
        [...emails],
        [(email) => email.Type.toLocaleUpperCase()]
      );

      return result;
    }
  );
}
