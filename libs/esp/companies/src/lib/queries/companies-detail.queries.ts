import { createPropertySelectors } from '@cosmos/state';
import { Email } from '@esp/models';
import { createSelector } from '@ngxs/store';
import { CompaniesState, CompaniesStateModel } from '../states';
import { sortBy } from 'lodash-es';

export namespace CompaniesDetailQueries {
  const { items, currentId } =
    createPropertySelectors<CompaniesStateModel>(CompaniesState);

  export const getCompany = createSelector(
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
