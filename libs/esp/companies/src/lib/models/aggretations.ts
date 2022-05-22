export interface Aggregations {
  Owners?: OwnerAggregation[];
}

// The format used is: Name:Id:isActive
export type OwnerAggregationSerialized = `${string}:${number}:${
  | 'True'
  | 'False'}`;

export interface ResponseAggregations {
  Owners?: OwnerAggregationSerialized[];
}

export interface OwnerAggregation {
  Id: number;
  Name: string;
  IconImageUrl: string | null;
  Email: string | null;
}
