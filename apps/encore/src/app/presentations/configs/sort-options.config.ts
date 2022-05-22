import { PresentationProductSortOrder } from '@esp/models';

export const productSortOptions: {
  name: string;
  value?: PresentationProductSortOrder;
}[] = [
  {
    name: 'Sort',
    value: 'None',
  },
  {
    name: 'Newest to oldest',
    value: 'Newest',
  },
  {
    name: 'Oldest to newest',
    value: 'Oldest',
  },
  {
    name: 'Product Name',
    value: 'NameAsc',
  },
  {
    name: 'Product Number',
    value: 'NumberAsc',
  },
  {
    name: 'Profit',
    value: 'ProfitAsc',
  },
  {
    name: 'Price (High to Low)',
    value: 'PriceDesc',
  },
  {
    name: 'Price (Low to High)',
    value: 'PriceAsc',
  },
  {
    name: 'Cost (High to Low)',
    value: 'CostDesc',
  },
  {
    name: 'Cost (Low to High)',
    value: 'CostAsc',
  },
  {
    name: 'Supplier Name',
    value: 'SupplierNameAsc',
  },
  {
    name: 'Category',
    value: 'CategoryAsc',
  },
];
