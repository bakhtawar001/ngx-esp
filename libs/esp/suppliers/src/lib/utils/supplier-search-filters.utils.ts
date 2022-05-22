import { SupplierFilter, SupplierSearchCriteria } from '../models';
import { FiltersForm, UrlFilters } from '../types';

export type SupplierCriteriaFilters = Pick<
  SupplierSearchCriteria,
  'excludeTerm' | 'filters'
>;

export function mapFiltersToSearchCriteria(
  form: FiltersForm
): SupplierCriteriaFilters {
  const facets: Partial<Record<keyof FiltersForm, SupplierFilter>> = {};
  if (form.MinorityOwned) {
    Object.assign(facets, {
      MinorityOwned: { terms: [`${form.MinorityOwned}`] },
    });
  }

  return {
    excludeTerm: null,
    filters: facets,
  };
}

export function mapSearchCriteriaToUrlFilters(
  criteria: SupplierSearchCriteria
): UrlFilters {
  const urlFilters: UrlFilters = {};
  if (criteria.excludeTerm) {
    Object.assign(urlFilters, { excludeTerm: criteria.excludeTerm });
  }
  if (criteria.filters?.MinorityOwned) {
    Object.assign(urlFilters, {
      minorityOwned: criteria.filters.MinorityOwned.terms[0],
    });
  }
  return urlFilters;
}

export function mapUrlFiltersToFiltersForm(filters: UrlFilters): FiltersForm {
  return {
    MinorityOwned: filters?.minorityOwned,
  };
}
