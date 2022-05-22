import { Injectable } from '@angular/core';
import { RestClient } from '@esp/common/http';
import { Note } from '@esp/models';

@Injectable({
  providedIn: 'root',
})
export class NotesService extends RestClient<Note> {
  override url = 'notes';
}
