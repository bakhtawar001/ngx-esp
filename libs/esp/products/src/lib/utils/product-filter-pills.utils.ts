// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { FilterPill } from '@asi/ui/feature-filters';
import { CHECK_BOXES, TYPE_AHEADS } from '../constants';
import { ProductSearchCriteria } from '../types';
import { priceFn, ratingFn } from './product-search-filters.utils';

export const filterPillsMapper = (
  criteria: ProductSearchCriteria
): FilterPill[] => {
  const pills: FilterPill[] = [];

  criteria.filters?.CategoryGroup?.terms?.forEach((cg) => {
    pills.push({
      ControlName: 'CategoryGroup',
      Label: `Category: ${cg}`,
    });
  });

  criteria.filters?.CategoryValue?.terms?.forEach((cv) => {
    pills.push({
      ControlName: 'CategoryValue',
      Label: `Sub-Category: ${cv}`,
      Value: cv,
    });
  });

  criteria.filters?.Supplier?.terms?.forEach((sup) => {
    pills.push({
      ControlName: 'Supplier',
      Label: `Supplier: ${sup}`,
      Value: sup,
    });
  });

  if (criteria.priceFilter?.Quantity) {
    pills.push({
      ControlName: 'Quantity',
      Label: `Quantity: ${criteria.priceFilter?.Quantity}`,
    });
  }

  if (criteria.priceFilter?.From || criteria.priceFilter?.To) {
    pills.push({
      ControlName: 'PriceFilter',
      Label: `Price: ${getFormattedLabel('Price', criteria)}`,
    });
  }

  const supplierRating = criteria.numericFilters?.filter((nf) => {
    return nf.Name === 'SupplierRating';
  });
  if (supplierRating?.length) {
    pills.push({
      ControlName: 'SupplierRating',
      Label: `Supplier Rating: ${getFormattedLabel('Rating', criteria)}`,
    });
  }

  criteria.filters?.Color?.terms?.forEach((col) => {
    pills.push({
      ControlName: 'Color',
      Label: `Color: ${col}`,
      Value: col,
    });
  });

  criteria.excludeTerm?.split(',')?.forEach((term) => {
    if (term) {
      pills.push({
        ControlName: 'ExcludeTerms',
        Label: `Exclude: ${term}`,
        Value: term,
      });
    }
  });

  Object.keys({ ...TYPE_AHEADS }).forEach((t) => {
    if (criteria.filters[t]) {
      pills.push({
        ControlName: 'TypeAheads',
        Value: t,
        Label: `${{ ...TYPE_AHEADS }[t]}: ${criteria.filters[t].terms[0]}`,
      });
    }
  });

  const productionTime = criteria.numericFilters?.filter((nf) => {
    return nf.Name === 'ProductionTime' || nf.Name === 'ProductionRushTime';
  });
  if (productionTime?.length) {
    const pTime = productionTime[0];
    pills.push({
      ControlName: 'TypeAheads',
      Label: `Production Time: ${pTime.To} day${pTime.To > 1 ? 's' : ''}`,
      Value: 'ProductionTime',
    });

    if (pTime.Name === 'ProductionRushTime') {
      pills.push({
        ControlName: 'IncludeRushTime',
        Label: 'Include Rush Time',
      });
    }
  }

  CHECK_BOXES.forEach((c) => {
    if (criteria.filters[c.value]) {
      pills.push({
        ControlName: 'CheckBoxes',
        Value: c.value,
        Label: c.label,
      });
    }
  });

  return pills;
};

const getFormattedLabel = (
  criteriaName: string,
  criteria: ProductSearchCriteria
): string => {
  switch (criteriaName) {
    case 'Price':
      return priceFn(criteria);
    case 'Rating':
      return ratingFn(criteria);
    default:
      throw new Error(`Unknown criteria name ${criteriaName}`);
  }
};
