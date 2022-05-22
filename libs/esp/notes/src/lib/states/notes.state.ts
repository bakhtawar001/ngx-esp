import { Injectable } from '@angular/core';
import { Note } from '@esp/models';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { NotesActions } from '../actions';
import { NotesService } from '../services';
import { NotesSearchState } from './notes-search.state';

export interface NotesStateModel {
  note: Note;
}

type ThisStateModel = NotesStateModel;
type ThisStateContext = StateContext<ThisStateModel>;

@State<NotesStateModel>({
  name: 'notes',
  defaults: {
    note: null!,
  },
  children: [NotesSearchState],
})
@Injectable()
export class NotesState {
  constructor(private _service: NotesService) {}

  @Action(NotesActions.GetNoteById)
  getNoteById(ctx: ThisStateContext, event: NotesActions.GetNoteById) {
    return this._service.get(event.id).pipe(
      tap((res) => {
        ctx.patchState({ note: res });
      })
    );
  }

  @Action(NotesActions.Update)
  update(ctx: ThisStateContext, { note }: NotesActions.Update) {
    return this._service.update(note).subscribe();

    //@TODO: Notes search
  }

  @Action(NotesActions.Delete)
  delete(ctx: ThisStateContext, { id }: NotesActions.Delete) {
    return this._service.delete(id).subscribe();

    //@TODO: Notes search
  }
}
