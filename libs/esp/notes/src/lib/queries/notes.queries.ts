import { createPropertySelectors } from '@cosmos/state';
import { NotesState, NotesStateModel } from '../states';

export namespace NotesQueries {
  export const { note: getNote } = createPropertySelectors<NotesStateModel>(
    NotesState
  );
}
