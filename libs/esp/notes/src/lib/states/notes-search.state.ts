import { Injectable } from '@angular/core';
import { Note } from '@esp/models';
import { SearchCriteria, SearchResult } from '@esp/models';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { NotesSearchActions } from '../actions';
import { NotesService } from '../services';

export interface NotesSearchStateModel extends SearchResult<Note> {
  criteria: SearchCriteria | null;
  companyNotes: SearchResult<Note>;
  contactNotes: SearchResult<Note>;
}

type ThisStateModel = NotesSearchStateModel;
type ThisStateContext = StateContext<ThisStateModel>;

@State<NotesSearchStateModel>({
  name: 'notesSearch',
  defaults: {
    criteria: new SearchCriteria(),
    Results: null!,
    ResultsTotal: 0,
    Aggregations: null!,
    companyNotes: null!,
    contactNotes: null!,
  },
})
@Injectable()
export class NotesSearchState {
  constructor(private _service: NotesService) {}

  @Action(NotesSearchActions.Search)
  search(ctx: ThisStateContext, event: NotesSearchActions.Search) {
    return this._service.query<Note>(event.criteria).pipe(
      tap((res) => {
        ctx.patchState({
          ...res,
        });
      })
    );
  }

  @Action(NotesSearchActions.GetNoteByContactId)
  getNoteByContactId(
    ctx: ThisStateContext,
    event: NotesSearchActions.GetNoteByContactId
  ) {
    return this._service
      .query<Note>({
        id: event.id,
        from: 1,
        size: 50,
      })
      .pipe(
        tap((res) => {
          ctx.patchState({
            contactNotes: res,
          });
        })
      );
  }

  @Action(NotesSearchActions.GetNoteByCompanyId)
  getNoteByCompanyId(
    ctx: ThisStateContext,
    event: NotesSearchActions.GetNoteByCompanyId
  ) {
    return this._service
      .query<Note>({
        id: event.id,
        from: 1,
        size: 50,
      })
      .pipe(
        tap((res) => {
          ctx.patchState({
            companyNotes: res,
          });
        })
      );
  }
}
