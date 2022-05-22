export interface SearchResult<T> {
  Results: T[];
  Query?: string;
  Breadcrumb?: string;
  Dimensions?: any;
  SearchId?: number;
  Page?: number;
  ResultsPerPage?: number;
  ResultsTotal?: number;
  SuppliersTotal?: number;
  CompletedIn?: number;
  Selections?: { [key: string]: any[] };
}
// ISearchDimensionSet Selections { get; set; }
// ISearchDimensionSet Dimensions { get; set; }
// [XmlArrayItem("Banner")]
// List<IAdBanner> Banners { get; set; }
// INavigation Links { get; set; }
// }
