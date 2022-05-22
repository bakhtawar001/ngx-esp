import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  PartyAvatarComponent,
  PartyAvatarComponentModule,
} from './party-avatar.component';

describe('PartyAvatarComponent', () => {
  const createComponent = createComponentFactory({
    component: PartyAvatarComponent,
    imports: [PartyAvatarComponentModule],
  });

  const testSetup = () => {
    const spectator = createComponent();
    return { component: spectator.component, spectator };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  describe('Avatar', () => {
    it('should have square class.', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.square = true;
      spectator.detectComponentChanges();

      // Assert
      expect('cos-avatar').toHaveClass('avatar-square');
    });

    it('should display image.', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.iconUrl = 'image.png';
      spectator.detectComponentChanges();

      // Assert
      expect('.avatar-image').toExist();
    });

    it('should display icon.', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.iconClass = 'fa fa-plus';
      spectator.detectComponentChanges();

      // Assert
      expect('.avatar-icon').toHaveClass('fa-plus');
    });

    it('should display initials.', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.name = 'John Doe';
      spectator.detectComponentChanges();

      // Assert
      expect('.avatar-wrapper').toContainText('JD');
    });
  });
});
