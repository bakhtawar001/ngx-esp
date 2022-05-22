import {
  AsiNoteCardComponent,
  AsiNoteCardModule,
} from './asi-note-card.component';
import { createComponentFactory } from '@ngneat/spectator';
import { InitialsPipe, InitialsPipeModule } from '@cosmos/common';
import { NotesMockDB } from '../../../../../../../esp/notes/__mocks__/note.mock';
import { Note } from '@esp/models';
import { CosCardMenuComponent } from '@cosmos/components/card';
import { CosAvatarListComponent } from '@cosmos/components/avatar-list';
import { CosSlideToggleComponent } from '@cosmos/components/toggle';
import { mockProvider } from '@ngneat/spectator/jest';
import { of } from 'rxjs';

describe('NoteCardComponent', () => {
  const createComponent = createComponentFactory({
    component: AsiNoteCardComponent,
    imports: [AsiNoteCardModule, InitialsPipeModule],
    declarations: [AsiNoteCardComponent],
    providers: [InitialsPipe],
  });

  const testSetup = (options?: { note?: Note; isEditState?: boolean }) => {
    const note = options?.note || NotesMockDB.Notes[0];
    const spectator = createComponent({
      props: {
        note: note || NotesMockDB.Notes[0],
      },
    });

    const component = spectator.component;
    component.isEditState = !!options?.isEditState;
    spectator.detectComponentChanges();

    return { spectator, component, note };
  };

  it('should create', () => {
    const { spectator } = testSetup();
    expect(spectator).toBeTruthy();
  });

  describe('display state', () => {
    describe('updated date', () => {
      it('should display created date if updated date is null', () => {
        const note = NotesMockDB.Notes[0];
        note.UpdateDate = null;
        const { spectator } = testSetup({ note });

        const updated = spectator.query('.card-header').textContent.trim();

        expect(updated).not.toEqual('Updated 52 years ago');
      });

      it('should display updated date correctly', () => {
        const note = NotesMockDB.Notes[0];
        const date = new Date().getTime();

        note.UpdateDate = new Date(date - 60 * 1000 * 3).toISOString();

        const { spectator } = testSetup({ note });
        const updated = spectator.query('.card-header').textContent.trim();

        expect(updated).toEqual('Updated 3 minutes ago');
      });
    });

    it('should display note content', () => {
      const { spectator, note } = testSetup();

      const noteContent = spectator.query('.card-wrapper').textContent.trim();

      expect(noteContent).toEqual(note.Content);
    });

    describe('three dot menu', () => {
      it('should be displayed if note is editable and state is not edit', () => {
        const note = NotesMockDB.Notes[0];
        note.IsEditable = true;
        const { spectator, component } = testSetup({ note });
        component.isEditState = false;

        const noteContent = spectator.query(CosCardMenuComponent);

        expect(noteContent).toBeTruthy();
      });

      it('should not be displayed if note is not editable', () => {
        const note = NotesMockDB.Notes[0];
        note.IsEditable = false;
        const { spectator } = testSetup({ note });

        const noteContent = spectator.query(CosCardMenuComponent);

        expect(noteContent).toBeFalsy();
      });
    });

    describe('footer', () => {
      it('should display avatar with name if note is not private', () => {
        const note = NotesMockDB.Notes[0];
        note.AccessLevel = 'Everyone';
        const { spectator } = testSetup({ note });

        const avatarsList = spectator.query(CosAvatarListComponent);
        const name = spectator.query('.card-footer > span').textContent;

        expect(avatarsList).toBeTruthy();
        expect(name).toEqual(note.UserName);
      });

      it('should display private sign with name if note is private', () => {
        const note = NotesMockDB.Notes[0];
        note.AccessLevel = 'Owner';
        const { spectator } = testSetup({ note });

        const avatarsList = spectator.query(CosAvatarListComponent);
        const spans = spectator.queryAll('.card-footer > span');
        const icon = spectator.query('.fa-lock');

        expect(avatarsList).toBeFalsy();
        expect(icon).toBeTruthy();
        expect(spans[0].textContent).toEqual('Private');
        expect(spans[1].textContent).toEqual(note.UserName);
      });
    });
  });

  describe('edit state', () => {
    it('should not display three dot menu', () => {
      const { spectator } = testSetup({ isEditState: true });

      const noteContent = spectator.query(CosCardMenuComponent);

      expect(noteContent).toBeFalsy();
    });

    it('textarea and toggle should contain note content if its passed', () => {
      const { spectator, component, note } = testSetup({ isEditState: true });

      const textarea = spectator.query('.note-card_textarea');
      const toggle = spectator.query(CosSlideToggleComponent);

      expect(textarea).toBeTruthy();
      expect(toggle).toBeTruthy();
      expect(component.noteValue.value).toEqual(note.Content);
      expect(component.isShared.value).toEqual(note.AccessLevel !== 'Owner');
    });

    it('should display buttons in footer', () => {
      const { spectator } = testSetup({ isEditState: true });

      const submitButton = spectator.query('div > .cos-flat-button');
      const cancelButton = spectator.query('div > .cos-stroked-button');

      expect(submitButton).toBeTruthy();
      expect(cancelButton).toBeTruthy();
    });

    it('submit button should be disabled if note is not changed', () => {
      const { spectator } = testSetup({ isEditState: true });

      const submitButton = spectator.query('div > .cos-flat-button');

      expect(submitButton).toBeDisabled();
    });

    it('submit button should be disabled if note is empty', () => {
      const { spectator, component } = testSetup({ isEditState: true });

      component.noteValue.setValue('');
      component.noteValue.markAsDirty();
      spectator.detectComponentChanges();

      const submitButton = spectator.query('div > .cos-flat-button');

      expect(submitButton).toBeDisabled();
    });

    it('submit button should not be disabled if note is changed', () => {
      const { spectator, component } = testSetup({ isEditState: true });

      component.noteValue.markAsDirty();
      spectator.detectComponentChanges();

      const submitButton = spectator.query('div > .cos-flat-button');

      expect(submitButton).not.toBeDisabled();
    });

    it('submit button should not be disabled if toggle is changed', () => {
      const { spectator, component } = testSetup({ isEditState: true });

      component.isShared.markAsDirty();
      spectator.detectComponentChanges();

      const submitButton = spectator.query('div > .cos-flat-button');

      expect(submitButton).not.toBeDisabled();
    });
  });
});
