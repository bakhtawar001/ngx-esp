export interface RatingCompany {
  Id: number;
  Name: string;
  AsiNumber: string;
}

export interface RatingComment {
  Comment: string;
  CreateDate: string;
  Distributor: RatingCompany;
}

export interface Rating {
  Rating: number;
  Companies?: number;
  Transactions: number;
  Reports?: number;
}

export interface Ratings {
  Comments?: RatingComment[];
  Communication: Rating;
  ConflictResolution: Rating;
  Decoration: Rating;
  Delivery: Rating;
  OverAll: Rating;
  Quality: Rating;
}
