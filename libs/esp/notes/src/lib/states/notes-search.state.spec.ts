import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Note } from '@esp/models';
import { NotesSearchActions } from '../actions';
import { NotesSearchQueries } from '../queries';
import { NotesService } from '../services';
import { SearchCriteria, SearchResult } from '@esp/models';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { NotesState, NotesStateModel } from './notes.state';
import { NotesSearchState, NotesSearchStateModel } from './notes-search.state';

describe('NotesSearchState', () => {
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

    store.reset({ notes: { ...state, notesSearch: { ...searchState } } });
  });

  it('Store should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('Notes Search State Actions', () => {
    it('should dispatch NotesSearchActions.Search and set note in state', () => {
      const response: SearchResult<Note> = {
        ResultsTotal: 77,
        Results: [],
        Aggregations: {
          Owners: [''],
          StepName: [''],
        },
      };

      const querySpy = jest
        .spyOn(service, 'query')
        .mockReturnValue(of(response));

      const value = new SearchCriteria();

      store.dispatch(new NotesSearchActions.Search(value));

      expect(querySpy).toHaveBeenCalledWith(value);
      const state = store.selectSnapshot(NotesSearchQueries.getSearchResult);

      expect(state).toEqual({ ...searchState, ...response });
    });

    it('should dispatch NotesSearchActions.GetNoteByContactId and set contactNotes in state', () => {
      const id = 1;
      const response: SearchResult<Note> = { id } as any;
      const payload = {
        id,
        from: 1,
        size: 50,
      };

      const querySpy = jest
        .spyOn(service, 'query')
        .mockReturnValue(of(response));

      store.dispatch(new NotesSearchActions.GetNoteByContactId(id));

      const contactNotes = store.selectSnapshot(
        NotesSearchQueries.getContactNotes
      );
      expect(contactNotes).toEqual(response);
      expect(querySpy).toHaveBeenCalledWith(payload);
    });

    it('should dispatch NotesSearchActions.GetNoteByCompanyId and set companyNotes in state', () => {
      const id = 1;
      const response: SearchResult<Note> = { id } as any;
      const payload = {
        id,
        from: 1,
        size: 50,
      };

      const querySpy = jest
        .spyOn(service, 'query')
        .mockReturnValue(of(response));

      store.dispatch(new NotesSearchActions.GetNoteByCompanyId(id));

      const companyNotes = store.selectSnapshot(
        NotesSearchQueries.getCompanyNotes
      );
      expect(companyNotes).toEqual(response);
      expect(querySpy).toHaveBeenCalledWith(payload);
    });
  });
});
