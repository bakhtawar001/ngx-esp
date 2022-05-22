import { InitialsPipe } from '@cosmos/common';
import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  RecordOwnerComponent,
  RecordOwnerComponentModule,
} from './record-owner.component';

describe('CompanyCardComponent', () => {
  const Owner = {
    IconImageUrl:
      'https://commonmedia.uat-asicentral.com/orders/Artwork/bbe1ccf644f9432bb8e27bbf407829ec.png',
    Id: 500020229,
    IsActive: false,
    Name: 'First Last Name',
    PersonId: 0,
  };

  const createComponent = createComponentFactory({
    component: RecordOwnerComponent,
    imports: [RecordOwnerComponentModule],
    providers: [InitialsPipe],
  });

  const testSetup = () => {
    const spectator = createComponent({
      props: {
        owner: Owner,
      },
    });
    return { component: spectator.component, spectator };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  describe('Owner', () => {
    it('should hide section when not provided', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.owner = null;
      spectator.detectComponentChanges();
      const section = spectator.queryAll('.record-owner');

      // Assert
      expect(section).not.toExist();
    });

    it('should show section when provided', () => {
      // Arrange
      const { spectator } = testSetup();
      const section = spectator.queryAll('.record-owner');

      // Assert
      expect(section).toExist();
    });

    it('should show owner info when provided', () => {
      // Arrange
      const { component, spectator } = testSetup();
      const name = 'name';

      // Act
      component.owner = { ...component.owner, Name: name };
      spectator.detectComponentChanges();
      const section = spectator.queryAll('.record-owner .record-owner-name');

      // Assert
      expect(section).toContainText(name);
    });

    it("should validate that the stored record owner is displayed as 'Record Managed by' on the card in the directory landing page with First name and last name presented", () => {
      // Arrange
      const { component, spectator } = testSetup();
      const recordHeader =
        spectator.query('.record-owner').children[1].children[0];
      const firstName = 'First';
      const lastName = 'Last';

      // Act
      component.owner = {
        ...component.owner,
        Name: `${firstName} ${lastName}`,
      };
      spectator.detectComponentChanges();
      const section = spectator.queryAll('.record-owner .record-owner-name');

      // Assert
      expect(recordHeader).toHaveText('Record Managed by:');
      expect(section).toContainText(`${firstName} ${lastName}`);
    });

    it("should validate that the stored record owner is displayed as 'Record Managed by' on the card in the directory landing page with Avatar", () => {
      // Arrange
      const { spectator } = testSetup();
      const recordHeader =
        spectator.query('.record-owner').children[1].children[0];
      const avatar = spectator.query('.record-owner > cos-avatar');

      // Assert
      expect(recordHeader).toHaveText('Record Managed by:');
      expect(avatar).toExist();
    });

    it('should apply standard avatar rules apply where initials are shown if there is no configured image for the contact', () => {
      // Arrange
      const { component, spectator } = testSetup();
      const firstName = 'First';
      const lastName = 'Last';

      // Act
      component.owner = {
        ...component.owner,
        Name: `${firstName} ${lastName}`,
        IconImageUrl: null,
      };
      spectator.detectComponentChanges();
      const initials = new InitialsPipe().transform(component.owner.Name);
      const avatar = spectator.query('.record-owner > cos-avatar');

      // Assert
      expect(spectator.query('.record-owner > cos-avatar > img')).not.toExist();
      expect(avatar).toExist();
      expect(avatar).toContainText(initials);
    });
  });
});
