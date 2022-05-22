import { AsiNoteActionsItemsComponent } from './asi-note-actions-items.component';
import { createComponentFactory } from '@ngneat/spectator';

describe('NoteActionsItemsComponent', () => {
  const createComponent = createComponentFactory({
    component: AsiNoteActionsItemsComponent,
  });

  const testSetup = () => {
    const spectator = createComponent({});
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('should display edit button', () => {
    const { spectator } = testSetup();
    const editButton = spectator.query('[data-cy=edit-button]');
    const editIcon = spectator.query('[data-cy=edit-button] > i');

    expect(editButton).toBeTruthy();
    expect(editButton).toHaveProperty('class', 'cos-menu-item');
    expect(editIcon).toBeTruthy();
    expect(editIcon).toHaveProperty('class', 'fas fa-pen');
  });

  it('should display delete button', () => {
    const { spectator } = testSetup();
    const deleteButton = spectator.query('[data-cy=delete-button]');
    const deleteIcon = spectator.query('[data-cy=delete-button] > i');

    expect(deleteButton).toBeTruthy();
    expect(deleteButton).toHaveProperty('class', 'cos-menu-item text-warning');
    expect(deleteIcon).toBeTruthy();
    expect(deleteIcon).toHaveProperty('class', 'fa fa-trash delete');
  });
});
