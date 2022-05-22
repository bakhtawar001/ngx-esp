export interface SearchResult<T, S = any> {
  Results?: T[];
  ResultsTotal?: number;
  Aggregations?: S;
}
