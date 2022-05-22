import {
  AsiContactActionsItemsComponent,
  AsiContactActionsItemsModule,
} from '@asi/contacts/ui/feature-components';
import { ContactsSearchMockDb } from '@esp/contacts/mocks';
import { ContactSearch } from '@esp/models';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { MockComponent, MockComponents } from 'ng-mocks';
import { AddressDisplayComponentModule } from '../../../directory/components/address-display';
import { AddressDisplayComponent } from '../../../directory/components/address-display/address-display.component';
import { PartyAvatarComponentModule } from '../../../directory/components/party-avatar';
import { PartyAvatarComponent } from '../../../directory/components/party-avatar/party-avatar.component';
import {
  RecordOwnerComponent,
  RecordOwnerComponentModule,
} from '../../../directory/components/record-owner/record-owner.component';
import {
  ContactCardComponent,
  ContactCardComponentModule,
} from './contact-card.component';

const contact: ContactSearch = ContactsSearchMockDb.SearchResponse.Results[0];

describe('ContactCardComponent', () => {
  const createComponent = createComponentFactory({
    component: ContactCardComponent,
    imports: [ContactCardComponentModule],
    overrideModules: [
      [
        AsiContactActionsItemsModule,
        {
          set: {
            declarations: [MockComponent(AsiContactActionsItemsComponent)],
            exports: [MockComponent(AsiContactActionsItemsComponent)],
          },
        },
      ],
      [
        PartyAvatarComponentModule,
        {
          set: {
            declarations: MockComponents(PartyAvatarComponent),
            exports: MockComponents(PartyAvatarComponent),
          },
        },
      ],
      [
        AddressDisplayComponentModule,
        {
          set: {
            declarations: MockComponents(AddressDisplayComponent),
            exports: MockComponents(AddressDisplayComponent),
          },
        },
      ],
      [
        RecordOwnerComponentModule,
        {
          set: {
            declarations: MockComponents(RecordOwnerComponent),
            exports: MockComponents(RecordOwnerComponent),
          },
        },
      ],
    ],
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
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should show active status when set', () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    component.contact.IsActive = true;
    spectator.detectComponentChanges();
    const section = spectator.queryAll('.party-status');

    // Assert
    expect(section).toHaveText('Active');
  });

  it('should show inactive status when set', () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    component.contact.IsActive = false;
    spectator.detectComponentChanges();
    const section = spectator.queryAll('.party-status');

    // Assert
    expect(section).toHaveText('Inactive');
  });

  it('should show created date', () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    component.contact.CreateDate = new Date(2020, 0, 1, 12, 0, 0, 0).toString();
    spectator.detectComponentChanges();
    const section = spectator.queryAll('.party-created');

    // Assert
    expect(section).toHaveText('Created Date: January 1, 2020');
  });

  describe('client contact', () => {
    it('should show contact primary phone if provided', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.contact.PrimaryPhone = '5555555';
      spectator.detectComponentChanges();
      const element = spectator.queryAll('.contact-phone');

      // Assert
      expect(element).toExist();
    });

    it('should show contact primary email if provided', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.contact.PrimaryEmail = 'email@email.com';
      spectator.detectComponentChanges();
      const element = spectator.queryAll('.contact-email');

      // Assert
      expect(element).toExist();
    });

    it('should show - for values when not provided', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.contact.PrimaryEmail = null;
      component.contact.PrimaryPhone = null;
      spectator.detectComponentChanges();
      const section = spectator.queryAll('.contact-info__no-value');

      // Assert
      expect(section).toExist();
    });
  });

  describe('3 dots menu tests', () => {
    it('Should display the 3 dot menu button for the entry', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.contact.IsEditable = true;
      spectator.detectComponentChanges();
      const threeDotsBtn = spectator.query('.mat-menu-trigger.cos-icon-button');
      const btnIcon = spectator.query('i.fa.fa-ellipsis-h');

      // Assert
      expect(threeDotsBtn).toExist();
      expect(threeDotsBtn.tagName).toBe('BUTTON');
      expect(threeDotsBtn).toHaveDescendant(btnIcon);
    });

    it('Should display the available option section when 3 dots button is clicked', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.contact.IsEditable = true;
      spectator.detectComponentChanges();
      spectator.click('.mat-menu-trigger.cos-icon-button');
      spectator.detectComponentChanges();
      const optionSection = spectator.query('.mat-menu-content');

      // Assert
      expect(optionSection).toExist();
    });

    it('Should display items component when 3 dots button is clicked', () => {
      // Arrange
      const { spectator } = testSetup();

      // Act
      spectator.detectComponentChanges();
      spectator.click('.mat-menu-trigger.cos-icon-button');
      spectator.detectComponentChanges();
      const buttonsComponent = spectator.query(AsiContactActionsItemsComponent);

      expect(buttonsComponent).toExist();
    });

    describe('Menu Items actions', () => {
      it("should open the Transfer ownership dialog when 'transferOwner' event is received", () => {
        // Arrange
        const { component, spectator } = testSetup();

        // Act
        const spy = jest.spyOn(component, 'onTransferOwner');
        component.contact.IsEditable = true;
        spectator.detectComponentChanges();
        spectator.click('.mat-menu-trigger.cos-icon-button');
        spectator.detectComponentChanges();
        const buttonsComponent = spectator.query(
          AsiContactActionsItemsComponent
        );
        buttonsComponent.transferOwner.emit();

        // Assert
        expect(spy).toHaveBeenCalled();
      });

      it("should make the contact Active/Inactive when 'toggleStatus' event is received", () => {
        // Arrange
        const { component, spectator } = testSetup();

        // Act
        const spy = jest.spyOn(component, 'onToggleStatus');
        component.contact.IsEditable = true;
        spectator.detectComponentChanges();
        spectator.click('.mat-menu-trigger.cos-icon-button');
        spectator.detectComponentChanges();
        const buttonsComponent = spectator.query(
          AsiContactActionsItemsComponent
        );
        buttonsComponent.toggleStatus.emit();

        // Assert
        expect(spy).toHaveBeenCalled();
      });

      it("should open the delete dialog when 'delete' event is received", () => {
        // Arrange
        const { component, spectator } = testSetup();

        // Act
        const spy = jest.spyOn(component, 'onDelete');
        component.contact.IsEditable = true;
        spectator.detectComponentChanges();
        spectator.click('.mat-menu-trigger.cos-icon-button');
        spectator.detectComponentChanges();
        const buttonsComponent = spectator.query(
          AsiContactActionsItemsComponent
        );
        buttonsComponent.delete.emit();

        // Assert
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
