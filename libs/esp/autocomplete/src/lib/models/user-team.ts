import { MediaLink } from '@esp/models';
import { AutocompleteValue } from './autocomplete-value';

export class UserTeam implements AutocompleteValue {
  IsTeam!: boolean;
  PersonId!: number;
  IsVisible!: boolean;
  Id!: number;
  Name!: string;
  Email?: string;
  IconMediaLink?: MediaLink;
}
