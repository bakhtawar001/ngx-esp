import { byTextContent, createComponentFactory } from '@ngneat/spectator/jest';
import {
  PasswordResetForm,
  PasswordResetFormModule,
} from './password-reset.form';

describe('PasswordResetForm', () => {
  const createComponent = createComponentFactory({
    component: PasswordResetForm,
    imports: [PasswordResetFormModule],
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

  it("should have 'Current Password' value as empty on load", () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component.form.get('existingPassword').value).toEqual('');
  });

  it('should show length warning message for new password', () => {
    // Arrange
    const { spectator } = testSetup();
    const lengthMessage = spectator.query(
      byTextContent('8-64 characters', {
        selector: '.password-requirement-bullets > li',
      })
    );

    // Assert
    expect(lengthMessage).toBeVisible();
  });

  it('should show alphanumeric warning message for new password', () => {
    // Arrange
    const { spectator } = testSetup();
    const alphaNumericMessage = spectator.query(
      byTextContent('Contains both alpha and numeric characters', {
        selector: '.password-requirement-bullets > li',
      })
    );

    // Assert
    expect(alphaNumericMessage).toBeVisible();
  });

  it('should show special character warning message for new password', () => {
    // Arrange
    const { component, spectator } = testSetup();
    const msg = `Support special characters: ${component.specialChars}`;
    const specialCharacterMessage = spectator.query(
      byTextContent(msg, {
        selector: '.password-requirement-bullets > li',
      })
    );

    // Assert
    expect(specialCharacterMessage).toBeVisible();
  });
});
