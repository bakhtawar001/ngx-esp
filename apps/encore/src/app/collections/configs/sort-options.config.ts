import type { SortOption } from '@esp/search';

export const sortOptions: SortOption[] = [
  {
    name: 'Last Updated',
    value: 'default',
  },
  {
    name: 'Oldest',
    value: 'oldest',
  },
  {
    name: 'Newest',
    value: 'newest',
  },
  {
    name: 'Name A-Z',
    value: 'az',
  },
  {
    name: 'Name Z-A',
    value: 'za',
  },
];

export const productSortOptions: SortOption[] = [
  {
    name: 'Recently Added',
    value: 'newest',
  },
  {
    name: 'Oldest',
    value: 'oldest',
  },
  {
    name: 'Category',
    value: 'category',
  },
  {
    name: 'Name A-Z',
    value: 'az',
  },
  {
    name: 'Name Z-A',
    value: 'za',
  },
  {
    name: 'By Price - Low to High',
    value: 'priceAsc',
  },
  {
    name: 'By Price - High to Low',
    value: 'priceDesc',
  },
];
