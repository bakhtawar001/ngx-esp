export interface Configuration {
  Support: {
    Phone: string;
    Email: string;
  };

  Search: {
    Sorting: {
      Products: SortOption[];
      Suppliers: SortOption[];
    };
  };
}

export interface SortOption {
  Id: number;
  Name: string;
  Description: string;
}
