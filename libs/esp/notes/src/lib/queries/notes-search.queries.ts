import { createPropertySelectors, createSelectorX } from '@cosmos/state';
import { NotesSearchState, NotesSearchStateModel } from '../states';

export namespace NotesSearchQueries {
  export const {
    companyNotes: getCompanyNotes,
    contactNotes: getContactNotes,
    criteria: getCriteria,
    Results: getResults,
  } = createPropertySelectors<NotesSearchStateModel>(NotesSearchState);

  export const getSearchResult = createSelectorX(
    [NotesSearchState],
    (state: NotesSearchStateModel) => state
  );
}
