import { ContactsSearchMockDb } from '@esp/contacts/mocks';
import { ContactSearch } from '@esp/models';
import { byText, createComponentFactory } from '@ngneat/spectator/jest';
import {
  ContactActionsItemsComponent,
  ContactActionsItemsModule,
} from './contact-actions-items.component';

const contact: ContactSearch = ContactsSearchMockDb.SearchResponse.Results[0];

describe('ContactActionsItemsComponent', () => {
  const createComponent = createComponentFactory({
    component: ContactActionsItemsComponent,
    imports: [ContactActionsItemsModule],
  });

  const testSetup = () => {
    const spectator = createComponent({
      props: { contact },
    });
    const component = spectator.component;
    return { component, spectator };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    const { component } = testSetup();

    expect(component).toBeTruthy();
  });

  it("Should display 3 options viz: 'Transfer Ownership', 'Make Inactive/Active' and 'Delete'", () => {
    const { component, spectator } = testSetup();

    component.contact.IsActive = false;
    spectator.detectComponentChanges();

    expect(spectator.query(byText('Make Active'))).toBeTruthy();
    expect(spectator.query(byText('Transfer Ownership'))).toBeTruthy();
    expect(spectator.query(byText('Delete'))).toBeTruthy();
  });

  it("Should display the button with text 'Make Active', when the contact status is inactive", () => {
    const { component, spectator } = testSetup();

    component.contact.IsActive = false;
    spectator.detectComponentChanges();
    const makeActiveButton = spectator.query(byText('Make Active'));
    const makeInactiveButton = spectator.query(byText('Make Inactive'));

    expect(makeActiveButton).toBeTruthy();
    expect(makeInactiveButton).toBeFalsy();
  });

  it('Should emit toggleStatus when "Make Active/Inactive" button was clicked', () => {
    const { component, spectator } = testSetup();
    jest.spyOn(component.toggleStatus, 'emit');

    const makeActiveButton = spectator.query(byText('Make Active'));
    spectator.click(makeActiveButton);

    expect(component.toggleStatus.emit).toHaveBeenCalled();
  });

  it('Should emit delete when "Delete" button was clicked', () => {
    const { component, spectator } = testSetup();
    jest.spyOn(component.delete, 'emit');

    const makeActiveButton = spectator.query(byText('Delete'));
    spectator.click(makeActiveButton);

    expect(component.delete.emit).toHaveBeenCalled();
  });

  it('Should emit transferOwner when "Transfer Owner" button was clicked', () => {
    const { component, spectator } = testSetup();
    jest.spyOn(component.transferOwner, 'emit');

    const makeActiveButton = spectator.query(byText('Transfer Ownership'));
    spectator.click(makeActiveButton);

    expect(component.transferOwner.emit).toHaveBeenCalled();
  });
});
