export interface SearchResult<T> {
  Results: T[];
  Query?: string;
  Breadcrumb?: string;
  Dimensions?: any;
  SearchId?: number;
  Page?: number;
  ResultsPerPage?: number;
  ResultsTotal?: number;
  CompletedIn?: number;
  ResultsTotalIsExhaustive?: boolean;
  MaxPage?: number;
  QueryId?: string;
  IndexName?: string;
}
