import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  COLOR_VALIDATION_PATTERN,
  EspBrandColorForm,
  EspBrandColorFormModule,
} from './brand-color.form';

describe('EspBrandColorForm', () => {
  const createComponent = createComponentFactory({
    component: EspBrandColorForm,
    imports: [EspBrandColorFormModule],
  });

  const testSetup = () => {
    const spectator = createComponent();
    const component = spectator.component;
    return { component, spectator };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it("should display the header as 'Enter a Color Value'", () => {
    // Arrange
    const { spectator } = testSetup();
    const label = spectator.query('.cos-form-field-label');

    // Assert
    expect(label).toExist();
    expect(label).toHaveText('Enter a Color Value');
  });

  it('should display a default color in a box', () => {
    // Arrange
    const { component, spectator } = testSetup();
    const colorBox = spectator.query('.colorblock');

    // Assert
    expect(colorBox).toHaveStyle({ backgroundColor: component.defaultColor });
  });

  it('should focus the input box to enter color and open the color picker, when color box is clicked', () => {
    // Arrange
    const { spectator } = testSetup();
    const colorBox = spectator.query('.colorblock');

    // Act
    spectator.click(colorBox);
    spectator.detectComponentChanges();
    const inputEl = spectator.query('.cos-input');
    const colorPicker = spectator.query('.color-picker');

    // Assert
    expect(inputEl).toBeFocused();
    expect(colorPicker).toExist();
    expect(colorPicker).toHaveClass('open');
  });

  it('should display an input box to display and enter a color', () => {
    // Arrange
    const { spectator } = testSetup();
    const inputEl = spectator.query('.cos-input');

    // Assert
    expect(inputEl).toExist();
  });

  it('should display the color picker, when the input is focused', () => {
    // Arrange
    const { spectator } = testSetup();
    const inputEl = spectator.query('.cos-input');

    // Act
    spectator.focus(inputEl);
    spectator.detectComponentChanges();
    const colorPicker = spectator.query('.color-picker');

    // Assert
    expect(colorPicker).toExist();
    expect(colorPicker).toHaveClass('open');
  });

  it('should change the color swatch with value change', () => {
    // Arrange
    const { component, spectator } = testSetup();
    const colorValue = '#333333';

    // Act
    component.control.setValue(colorValue);
    spectator.detectComponentChanges();
    const colorswatch = spectator.query('.colorblock');

    // Assert
    expect(colorswatch).toHaveStyle({ backgroundColor: colorValue });
  });

  it("should default the color value to '#6A7281', when value changed to empty string", () => {
    // Arrange
    const { component, spectator } = testSetup();
    const colorValue = '#333333';

    // Act
    component.control.setValue(colorValue);
    spectator.detectComponentChanges();
    let colorswatch = spectator.query('.colorblock');

    // Assert
    expect(colorswatch).toHaveStyle({ backgroundColor: colorValue });

    // Act again
    component.control.setValue('');
    spectator.detectComponentChanges();
    colorswatch = spectator.query('.colorblock');

    // Re-Assert
    expect(colorswatch).toHaveStyle({
      backgroundColor: component.defaultColor,
    });
  });

  it('Should show validation errors for invalid Hexa values', () => {
    // Arrange
    const { component, spectator } = testSetup();

    const invalidValues = ['666666', '#666AAAFF', '#%^&**()', '#999A'];
    invalidValues.forEach((colorValue) => {
      // Act
      component.control.setValue(colorValue);
      spectator.detectChanges();

      //Assert
      expect(component.control.valid).toBeFalsy();
      expect(component.control.errors.pattern.requiredPattern).toEqual(
        COLOR_VALIDATION_PATTERN.toString()
      );
      expect(component.control?.errors?.pattern?.actualValue).toEqual(
        colorValue
      );
    });
  });
  it('Should not show validation errors for correct hexa decimal values', () => {
    // Arrange
    const { component, spectator } = testSetup();

    const correctValues = ['#123456', '#6AF', '#14155A'];

    correctValues.forEach((colorValue) => {
      // Act
      component.control.setValue(colorValue);
      spectator.detectChanges();

      //Assert
      expect(component.control.valid).toBeTruthy();
      expect(component.control.errors).toBeFalsy();
    });
  });
});
