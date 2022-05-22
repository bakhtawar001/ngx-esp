export class UrlPriceFilter {
  from?: number;
  to?: number;
  quantity?: number;
}

export class UrlFilters {
  category?: string[];
  categoryGroup?: string[];
  color?: string[];
  exclude?: string;
  imprintMethod?: string[];
  linename?: string[];
  material?: string[];
  price?: UrlPriceFilter;
  productionTime?: number;
  rating?: number;
  shape?: string[];
  size?: string[];
  supplier?: string[];
  theme?: string[];
  tradename?: string[];

  checked?: string[];
}
