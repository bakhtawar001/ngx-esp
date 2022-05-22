import { fakeAsync } from '@angular/core/testing';
import { CosSlideToggleComponent } from '@cosmos/components/toggle';
import { PresentationMockDb } from '@esp/__mocks__/presentations';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { timer } from 'rxjs';
import { PresentationLocalState } from '../../local-states';
import {
  PresentationSettingsComponent,
  PresentationSettingsComponentModule,
} from './presentation-settings.component';

const presentation = PresentationMockDb.presentation;

describe('PresentationSettingsComponent', () => {
  const createComponent = createComponentFactory({
    component: PresentationSettingsComponent,
    imports: [PresentationSettingsComponentModule],
    providers: [
      mockProvider(PresentationLocalState, {
        presentation,
        save: () => timer(1000),
      }),
    ],
  });

  const testSetup = () => {
    const spectator = createComponent();
    const state = spectator.inject(PresentationLocalState, true);
    return { state, spectator, component: spectator.component };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    // Arrange & act
    const { spectator, component } = testSetup();
    spectator.detectComponentChanges();

    // Assert
    expect(component).toExist();
  });

  describe('Toggles', () => {
    it('should render all toggles', () => {
      // Arrange & act
      const { spectator, component } = testSetup();
      spectator.detectComponentChanges();

      // Assert
      expect(spectator.queryAll('cos-toggle').length).toEqual(
        component.toggles.length
      );
    });

    // Code change required
    it('should have all toggles defaulted to the enabled state', () => {
      // Arrange
      const { spectator } = testSetup();
      const toggles = spectator.queryAll('cos-toggle');

      // Act
      toggles.forEach((toggle) => {
        spectator.click(toggle);
      });
      spectator.detectComponentChanges();

      // Assert
      toggles.forEach((toggle, i) => {
        expect(toggles[i]).not.toHaveClass('cos-checked');
        expect(toggles[i]).toHaveClass('cos-disabled');
      });
    });

    it("should allow a user to hide/show 'Product CPN' from showing on the customer facing presentation", () => {
      // Arrange
      const { component, spectator, state } = testSetup();
      const productCPNToggle = spectator.queryAll('cos-toggle')[0];
      const stateSpy = jest.spyOn(state, 'save');
      jest.spyOn(component, 'updateSetting');

      // Act
      spectator.click(productCPNToggle);
      const productCPNToggleLabel = spectator
        .queryAll('cos-toggle')[0]
        .querySelector('.cos-slide-toggle-content');

      // Assert
      expect(component.updateSetting).toHaveBeenCalledWith(
        component.toggles[0]
      );
      expect(productCPNToggleLabel).toHaveText(component.toggles[0].label);
      expect(productCPNToggleLabel).toHaveText('Product CPN');
      expect(stateSpy).toHaveBeenCalledWith({
        ...state.presentation,
        Settings: {
          ...state.presentation.Settings,
          [component.toggles[0].settingName]: !component.toggles[0].value,
        },
      });
    });

    it("should allow a user to hide/show 'Imprint Options' on all products in the presentation", () => {
      // Arrange
      const { component, spectator, state } = testSetup();
      const imprintOptionsToggle = spectator.queryAll('cos-toggle')[1];
      const stateSpy = jest.spyOn(state, 'save');
      jest.spyOn(component, 'updateSetting');

      // Act
      spectator.click(imprintOptionsToggle);
      const imprintOptionsToggleLabel = spectator
        .queryAll('cos-toggle')[1]
        .querySelector('.cos-slide-toggle-content');

      // Assert
      expect(component.updateSetting).toHaveBeenCalledWith(
        component.toggles[1]
      );
      expect(imprintOptionsToggleLabel).toHaveText(component.toggles[1].label);
      expect(imprintOptionsToggleLabel).toHaveText('Imprint Options');
      expect(stateSpy).toHaveBeenCalledWith({
        ...state.presentation,
        Settings: {
          ...state.presentation.Settings,
          [component.toggles[1].settingName]: !component.toggles[1].value,
        },
      });
    });

    it("should allow a user to hide/show 'Pricing' on all products in the presentation", () => {
      // Arrange
      const { component, spectator, state } = testSetup();
      const pricingToggle = spectator.queryAll('cos-toggle')[2];
      const stateSpy = jest.spyOn(state, 'save');
      jest.spyOn(component, 'updateSetting');

      // Act
      spectator.click(pricingToggle);
      const pricingToggleLabel = spectator
        .queryAll('cos-toggle')[2]
        .querySelector('.cos-slide-toggle-content');

      // Assert
      expect(component.updateSetting).toHaveBeenCalledWith(
        component.toggles[2]
      );
      expect(pricingToggleLabel).toHaveText(component.toggles[2].label);
      expect(pricingToggleLabel).toHaveText('Pricing');
      expect(stateSpy).toHaveBeenCalledWith({
        ...state.presentation,
        Settings: {
          ...state.presentation.Settings,
          [component.toggles[2].settingName]: !component.toggles[2].value,
        },
      });
    });

    it("should allow a user to hide/show 'Price Range' on all products in the presentation", () => {
      // Arrange
      const { component, spectator, state } = testSetup();
      const priceRangeToggle = spectator.queryAll('cos-toggle')[3];
      const stateSpy = jest.spyOn(state, 'save');
      jest.spyOn(component, 'updateSetting');

      // Act
      spectator.click(priceRangeToggle);
      const priceRangeToggleLabel = spectator
        .queryAll('cos-toggle')[3]
        .querySelector('.cos-slide-toggle-content');

      // Assert
      expect(component.updateSetting).toHaveBeenCalledWith(
        component.toggles[3]
      );
      expect(priceRangeToggleLabel).toHaveText(component.toggles[3].label);
      expect(priceRangeToggleLabel).toHaveText('Price Range');
      expect(stateSpy).toHaveBeenCalledWith({
        ...state.presentation,
        Settings: {
          ...state.presentation.Settings,
          [component.toggles[3].settingName]: !component.toggles[3].value,
        },
      });
    });

    it("should allow a user to hide/show 'Additional Charges' on all products in the presentation", () => {
      // Arrange
      const { component, spectator, state } = testSetup();
      const additionalChargesToggle = spectator.queryAll('cos-toggle')[4];
      const stateSpy = jest.spyOn(state, 'save');
      jest.spyOn(component, 'updateSetting');

      // Act
      spectator.click(additionalChargesToggle);
      const additionalChargesToggleLabel = spectator
        .queryAll('cos-toggle')[4]
        .querySelector('.cos-slide-toggle-content');

      // Assert
      expect(component.updateSetting).toHaveBeenCalledWith(
        component.toggles[4]
      );
      expect(additionalChargesToggleLabel).toHaveText(
        component.toggles[4].label
      );
      expect(additionalChargesToggleLabel).toHaveText('Additional Charges');
      expect(stateSpy).toHaveBeenCalledWith({
        ...state.presentation,
        Settings: {
          ...state.presentation.Settings,
          [component.toggles[4].settingName]: !component.toggles[4].value,
        },
      });
    });

    it("should allow a user to hide/show 'Product Color' on all products in the presentation", () => {
      // Arrange
      const { component, spectator, state } = testSetup();
      const productColorToggle = spectator.queryAll('cos-toggle')[5];
      const stateSpy = jest.spyOn(state, 'save');
      jest.spyOn(component, 'updateSetting');

      // Act
      spectator.click(productColorToggle);
      const productColorToggleLabel = spectator
        .queryAll('cos-toggle')[5]
        .querySelector('.cos-slide-toggle-content');

      // Assert
      expect(component.updateSetting).toHaveBeenCalledWith(
        component.toggles[5]
      );
      expect(productColorToggleLabel).toHaveText(component.toggles[5].label);
      expect(productColorToggleLabel).toHaveText('Product Color');
      expect(stateSpy).toHaveBeenCalledWith({
        ...state.presentation,
        Settings: {
          ...state.presentation.Settings,
          [component.toggles[5].settingName]: !component.toggles[5].value,
        },
      });
    });

    it("should allow a user to hide/show 'Product Size' on all products in the presentation", () => {
      // Arrange
      const { component, spectator, state } = testSetup();
      const productSizeToggle = spectator.queryAll('cos-toggle')[6];
      const stateSpy = jest.spyOn(state, 'save');
      jest.spyOn(component, 'updateSetting');

      // Act
      spectator.click(productSizeToggle);
      const productSizeToggleLabel = spectator
        .queryAll('cos-toggle')[6]
        .querySelector('.cos-slide-toggle-content');

      // Assert
      expect(component.updateSetting).toHaveBeenCalledWith(
        component.toggles[6]
      );
      expect(productSizeToggleLabel).toHaveText(component.toggles[6].label);
      expect(productSizeToggleLabel).toHaveText('Product Size');
      expect(stateSpy).toHaveBeenCalledWith({
        ...state.presentation,
        Settings: {
          ...state.presentation.Settings,
          [component.toggles[6].settingName]: !component.toggles[6].value,
        },
      });
    });

    it("should allow a user to hide/show 'Product Shape' on all products in the presentation", () => {
      // Arrange
      const { component, spectator, state } = testSetup();
      const productShapeToggle = spectator.queryAll('cos-toggle')[7];
      const stateSpy = jest.spyOn(state, 'save');
      jest.spyOn(component, 'updateSetting');

      // Act
      spectator.click(productShapeToggle);
      const productShapeToggleLabel = spectator
        .queryAll('cos-toggle')[7]
        .querySelector('.cos-slide-toggle-content');

      // Assert
      expect(component.updateSetting).toHaveBeenCalledWith(
        component.toggles[7]
      );
      expect(productShapeToggleLabel).toHaveText(component.toggles[7].label);
      expect(productShapeToggleLabel).toHaveText('Product Shape');
      expect(stateSpy).toHaveBeenCalledWith({
        ...state.presentation,
        Settings: {
          ...state.presentation.Settings,
          [component.toggles[7].settingName]: !component.toggles[7].value,
        },
      });
    });

    it("should allow a user to hide/show 'Product Material' on all products in the presentation", () => {
      // Arrange
      const { component, spectator, state } = testSetup();
      const productMaterialToggle = spectator.queryAll('cos-toggle')[8];
      const stateSpy = jest.spyOn(state, 'save');
      jest.spyOn(component, 'updateSetting');

      // Act
      spectator.click(productMaterialToggle);
      const productMaterialToggleLabel = spectator
        .queryAll('cos-toggle')[8]
        .querySelector('.cos-slide-toggle-content');

      // Assert
      expect(component.updateSetting).toHaveBeenCalledWith(
        component.toggles[8]
      );
      expect(productMaterialToggleLabel).toHaveText(component.toggles[8].label);
      expect(productMaterialToggleLabel).toHaveText('Product Material');
      expect(stateSpy).toHaveBeenCalledWith({
        ...state.presentation,
        Settings: {
          ...state.presentation.Settings,
          [component.toggles[8].settingName]: !component.toggles[8].value,
        },
      });
    });
  });

  it('should disable setting before it gets updated and then enable it', fakeAsync(() => {
    // Arrange & act
    const { spectator } = testSetup();
    spectator.detectComponentChanges();
    const toggle = spectator.query(CosSlideToggleComponent);

    // Assert
    expect(toggle.disabled).toEqual(false);
    expect(toggle.checked).toEqual(false);

    spectator.click(spectator.query('cos-toggle:first-child'));
    expect(toggle.disabled).toEqual(true);

    spectator.tick(1000);

    expect(toggle.disabled).toEqual(false);
    expect(toggle.checked).toEqual(true);
  }));
});
