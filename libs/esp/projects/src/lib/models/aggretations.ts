export interface Aggregations {
  Owners?: OwnerAggregation[];
  StepName?: string[];
}

export interface ResponseAggregations {
  Owners?: string[];
  StepName?: string[];
}

export interface OwnerAggregation {
  Id: string;
  Name: string;
  IconImageUrl: string | null;
  Email: string;
  IsActive: boolean;
}
