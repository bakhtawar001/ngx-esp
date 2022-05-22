import { asDispatch, LocalState } from '@cosmos/state';
import { NotesActions } from '../actions/notes.actions';
import { Injectable } from '@angular/core';

@Injectable()
export class NotesLocalState extends LocalState<NotesLocalState> {
  readonly update = asDispatch(NotesActions.Update);
  readonly delete = asDispatch(NotesActions.Delete);
}
