import { SearchFilter } from '@esp/models';
import { DateRange } from '@angular/material/datepicker';

export type SearchTermControl = keyof Pick<
  FiltersForm,
  'OwnersSearchTerm' | 'StepNameSearchTerm'
>;

export interface FiltersForm {
  InHandsDate?: DateRange<Date>;
  EventDate?: DateRange<Date>;
  OwnersSearchTerm?: string;
  Owners?: SearchFilter;
  StepNameSearchTerm?: string;
  StepName?: SearchFilter;
}
