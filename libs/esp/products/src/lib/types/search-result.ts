import { Aggregations, PfpDiagnostics } from '@esp/products';

export interface SearchResult<T> {
  Aggregations?: Aggregations;
  Results: T[];
  Query?: string;
  Breadcrumb?: string;
  Dimensions?: any;
  SearchId?: number;
  PfpDiagnostics?: PfpDiagnostics;
  Page?: number;
  ResultsPerPage?: number;
  ResultsTotal?: number;
  SuppliersTotal?: number;
  OrganicSize?: number;
  CompletedIn?: number;
  Selections?: { [key: string]: any[] };
  ResultsTotalIsExhaustive?: boolean;
  MaxPage?: number;

  QueryId?: string;
  IndexName?: string;
}
