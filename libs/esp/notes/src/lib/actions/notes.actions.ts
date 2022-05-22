import { Note } from '@esp/models';

const ACTION_SCOPE = '[Notes]';

export namespace NotesActions {
  export class GetNoteById {
    static type = `${ACTION_SCOPE} GetNoteById`;

    constructor(public id: number) {}
  }

  export class Update {
    static type = `${ACTION_SCOPE} Update`;

    constructor(public note: Note) {}
  }

  export class Delete {
    static type = `${ACTION_SCOPE} Delete`;

    constructor(public id: number) {}
  }
}
