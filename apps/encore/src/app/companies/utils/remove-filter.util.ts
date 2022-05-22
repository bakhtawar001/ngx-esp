import { CompanySearchFilters } from '@esp/companies';

export function removeFilter(
  payload: {
    ControlName?: string;
    Value?: string | number;
    ClearAll?: boolean;
  },
  appliedFilters: CompanySearchFilters
): CompanySearchFilters {
  let filters: CompanySearchFilters;
  if (payload.ClearAll) {
    filters = {};
  } else {
    const { [payload.ControlName]: filterToRemove, ...remainingFilters } =
      appliedFilters;

    const terms = ((filterToRemove?.terms ?? []) as string[]).filter(
      (id) => id != payload.Value
    );

    filters = {
      ...remainingFilters,
      ...(terms.length && {
        [payload.ControlName]: { terms, behavior: 'any' },
      }),
    };
  }

  return filters;
}
