import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { MockModule, MockProvider } from 'ng-mocks';
import {
  ProjectCloseDialog,
  ProjectCloseDialogModule,
} from './project-close.dialog';

const testData = {
  title: dataCySelector('dialog-header'),
  subtitle: dataCySelector('dialog-sub-header'),
  noteLabel: dataCySelector('note-textarea-label'),
  textarea: dataCySelector('note-textarea'),
  selectLabel: dataCySelector('resolution-select-label'),
  select: dataCySelector('resolution-select'),
  closeButton: dataCySelector('close-project-button'),
};

const createComponent = createComponentFactory({
  component: ProjectCloseDialog,
  imports: [ProjectCloseDialogModule, MockModule(MatDialogModule)],
  providers: [
    MockProvider(MatDialogRef, {
      close: jest.fn(),
    }),
  ],
});

const testSetup = () => {
  const spectator = createComponent();

  return { spectator, component: spectator.component };
};

describe('ProjectCloseDialog', () => {
  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('should display title `Close Project`', () => {
    const { spectator } = testSetup();

    expect(spectator.query(testData.title).textContent.trim()).toEqual(
      'Close Project'
    );
  });

  it('should display subtitle `Closing a project`', () => {
    const { spectator } = testSetup();

    expect(spectator.query(testData.subtitle).textContent.trim()).toEqual(
      'Closing a project'
    );
  });

  it('should display label `Note`', () => {
    const { spectator } = testSetup();

    expect(spectator.query(testData.noteLabel).textContent.trim()).toEqual(
      'Note'
    );
  });

  describe('Resolution select', () => {
    it('should display Resolution select', () => {
      const { spectator } = testSetup();

      expect(spectator.query(testData.select)).toBeTruthy();
    });

    it('should display only Completed and Lost options with Completed as default', () => {
      const { spectator } = testSetup();

      const select = spectator.query(testData.select);
      expect(select.children[0].textContent.trim()).toEqual('Completed');
      expect(select.children[1].textContent.trim()).toEqual('Lost');
      expect(select.children[2]).toBeFalsy();
    });
  });

  it('should display Close Project CTA', () => {
    const { spectator } = testSetup();

    expect(spectator.query(testData.closeButton).textContent.trim()).toEqual(
      'Close Project'
    );
  });

  describe('Note textarea', () => {
    it('should display textarea', () => {
      const { spectator } = testSetup();

      expect(spectator.query(testData.textarea)).toBeTruthy();
    });

    it('should check if textarea has maxlength 500', () => {
      const { spectator } = testSetup();

      expect(
        spectator.query(testData.textarea).getAttribute('maxlength')
      ).toEqual('500');
    });
  });

  it('should close with note and resolution', () => {
    const { spectator } = testSetup();
    const dialogRef = spectator.inject(MatDialogRef, true);

    spectator.typeInElement('test note', spectator.query(testData.textarea));
    spectator.detectChanges();
    spectator.click(spectator.query(testData.closeButton));

    expect(dialogRef.close).toHaveBeenCalledWith({
      Note: 'test note',
      Resolution: 'Completed',
    });
  });
});
