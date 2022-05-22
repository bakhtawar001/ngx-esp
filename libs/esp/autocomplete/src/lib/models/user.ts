import { AutocompleteValue } from './autocomplete-value';

export class Role {
  Id!: number;
  Code!: string;
  Name!: string;
}

export class User implements AutocompleteValue {
  Id!: number;
  PersonId!: number;
  Name!: string;
  IsActive!: boolean;
  Email?: string;
  Roles!: Role[];
}
