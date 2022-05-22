export class AutocompleteParams {
  excludelist?: string | number[];
  filters?: {
    [key: string]: {
      Terms: string | number[];
      Behavior: string;
    };
  };
  size?: number;
  status?: string;
  term!: string;
  type?: string;
}
