import { ProductSearchCriteria } from '../types';
import { filterPillsMapper } from './product-filter-pills.utils';

const productionRushTimeCriteria: ProductSearchCriteria = {
  term: '',
  excludeTerm: '',
  organicSize: 0,
  priceFilter: {},
  numericFilters: [{ Name: 'SupplierRating' }, { Name: 'ProductionRushTime' }],
  filters: {},
  from: 0,
  size: 0,
  sortBy: 'desc',
  aggregationsOnly: true,
  aggregationsToInclude: [],
};

const productAllCriteria: ProductSearchCriteria = {
  term: '',
  excludeTerm: 'exclude term',
  organicSize: 0,
  priceFilter: {
    Quantity: 1,
    From: 0,
    To: 1,
  },
  numericFilters: [{ Name: 'SupplierRating' }, { Name: 'ProductionTime' }],
  filters: {
    CategoryGroup: { terms: ['group'] },
    CategoryValue: { terms: ['value'] },
    Supplier: { terms: ['supplier'] },
    Color: { terms: ['red'] },
    Shape: { terms: ['rect'] },
    Size: { terms: ['small'] },
    Theme: { terms: ['none'] },
    TradeName: { terms: ['tradename'] },
    ImprintMethod: { terms: ['method'] },
    LineName: { terms: ['line'] },
    Market: { terms: ['USALL'] },
    Material: { terms: ['cotton'] },
    HasLiveFeed: { terms: [1] },
    HasRushService: { terms: [1] },
    HasPrice: { terms: [1] },
    IsUnionAffiliated: { terms: [1] },
    CanadianPriced: { terms: [1] },
    Ecommerce: { terms: [1] },
    HasChokingHazards: { terms: [1] },
    HasFullColorProcess: { terms: [1] },
    HasHazardMaterials: { terms: [1] },
    HasImage: { terms: [1] },
    HasLiveInventory: { terms: [1] },
    HasPersonalization: { terms: [1] },
    HasProductVideo: { terms: [1] },
    HasProp65Warnings: { terms: [1] },
    HasSpecial: { terms: [1] },
    HasUnimprinted: { terms: [1] },
    HasVirtualSample: { terms: [1] },
    IsMinorityOwned: { terms: [1] },
    IsNew: { terms: [1] },
    MadeInUsa: { terms: [1] },
    UsPriced: { terms: [1] },
    IncludeRushTime: { terms: [1] },
  },
  from: 0,
  size: 0,
  sortBy: 'desc',
  aggregationsOnly: true,
  aggregationsToInclude: [],
};

describe('test product-filter-pills utils functions', () => {
  it('should return filterPills in required form', () => {
    expect(filterPillsMapper(productAllCriteria)).toHaveLength(27);
    expect(filterPillsMapper(productionRushTimeCriteria)).toHaveLength(3);
  });
});
