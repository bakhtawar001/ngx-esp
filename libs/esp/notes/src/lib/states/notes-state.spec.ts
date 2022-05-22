import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotesQueries } from '../queries';
import { NotesService } from '../services';
import { NotesActions } from '../actions';
import { SearchCriteria } from '@esp/models';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { NotesSearchState, NotesSearchStateModel } from './notes-search.state';
import { NotesState, NotesStateModel } from './notes.state';

describe('NotesState', () => {
  let store: Store;
  let service: NotesService;
  let spectator;

  const state: NotesStateModel = {
    note: null,
  };

  const searchState: NotesSearchStateModel = {
    criteria: new SearchCriteria(),
    Results: null,
    ResultsTotal: 0,
    Aggregations: null,
    companyNotes: null,
    contactNotes: null,
  };

  const createService = createServiceFactory({
    service: Store,
    imports: [
      NgxsModule.forRoot([NotesState, NotesSearchState]),
      HttpClientTestingModule,
    ],
    providers: [NotesService],
  });

  beforeEach(() => {
    spectator = createService();
    store = spectator.inject(Store);
    service = spectator.inject(NotesService);

    store.reset({
      notes: { ...state, notesSearch: { ...searchState } },
    });
  });

  it('Store should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('Notes State Actions', () => {
    it('should dispatch NotesActions.GetNoteById and set note value in state', () => {
      const id = 123;
      const note = { Results: { id } };
      const getSpy = jest
        .spyOn(service, 'get')
        .mockReturnValue(of(note as any));

      store.dispatch(new NotesActions.GetNoteById(id));

      const result = store.selectSnapshot(NotesQueries.getNote);

      expect(result).toBe(note);
      expect(getSpy).toHaveBeenCalledWith(id);
    });
  });
});
