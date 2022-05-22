export interface AggregateValue {
  Value: string;
  Count?: number;
}

export interface TypeAheads<T> {
  ImprintMethod?: T;
  LineName?: T;
  Material?: T;
  ProductionTime?: T;
  Shape?: T;
  Size?: T;
  Theme?: T;
  TradeName?: T;
}

export interface Aggregations extends TypeAheads<AggregateValue[]> {
  CategoryGroup?: AggregateValue[];
  CategoryValue?: AggregateValue[];
  Color?: AggregateValue[];
  Supplier?: AggregateValue[];
}
