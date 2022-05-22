import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory } from '@ngneat/spectator';
import { MOCK_PRODUCT } from '../../mock_data/product_data.mock';
import {
  PresentationProductPage,
  PresentationProductPageModule,
} from './presentation-product.page';

describe('PresentationProductPage', () => {
  let product: any;

  const createComponent = createComponentFactory({
    component: PresentationProductPage,
    imports: [RouterTestingModule, PresentationProductPageModule],
  });

  const testSetup = () => {
    let spectator = createComponent();

    const component = spectator.component;

    return { spectator, component };
  };

  it('should create', () => {
    // Arrange
    const { component, spectator } = testSetup();

    //Assert
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  describe('Back to product nav', () => {
    it('should exist back to product nav link', () => {
      const { spectator } = testSetup();
      const backToProductLink = spectator.query('.back-link');

      expect(backToProductLink.textContent).toContain('Back to all products');
    });

    it('should navigate on parent route Products by clicking on link', () => {
      const { spectator } = testSetup();
      let router = spectator.inject(Router);
      const backToProductLink = spectator.query('.back-link');

      jest.spyOn(router, 'navigate').mockResolvedValue(true);

      spectator.click(backToProductLink);

      expect(router.navigate).toHaveBeenCalledWith(['./']);
    });
  });

  describe('Render sections based on data availability', () => {
    beforeEach(() => {
      product = MOCK_PRODUCT;
    });
    it('should not render Notification section if Note data is not present', () => {
      const { spectator, component } = testSetup();

      product = {
        ...product,
        Note: '',
      };

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-notification')).toBeFalsy();
    });
    it('should render Notification section if Note data is present', () => {
      const { spectator, component } = testSetup();

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-notification')).toBeTruthy();
    });
    it('should not render Discount section if Discount data is not present', () => {
      const { spectator, component } = testSetup();

      product = {
        ...product,
        Discount: '',
      };

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-discount')).toBeFalsy();
    });
    it('should render Discount section if Discount data is present', () => {
      const { spectator, component } = testSetup();

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-discount')).toBeTruthy();
    });
    it('should not render Pricing table if Pricing data is not present', () => {
      const { spectator, component } = testSetup();

      product = {
        ...product,
        dataSourcePricing: [],
      };

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-pricing')).toBeFalsy();
    });
    it('should render Pricing table if Pricing data is present', () => {
      const { spectator, component } = testSetup();

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-pricing')).toBeTruthy();
    });
    it('should not render Addition charges table if Additional charges data is not present', () => {
      const { spectator, component } = testSetup();

      product = {
        ...product,
        dataSourceAdditionalCharges: [],
      };

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-additional-charges')).toBeFalsy();
    });
    it('should render Addition charges table if Additional charges data is present', () => {
      const { spectator, component } = testSetup();

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-additional-charges')).toBeTruthy();
    });
    it('should not render Shipping charges table if Shipping charges data is not present', () => {
      const { spectator, component } = testSetup();

      product = {
        ...product,
        dataSourceShippingMethod: [],
      };

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-shipping-method')).toBeFalsy();
    });
    it('should render Shipping charges table if Shipping charges data is present', () => {
      const { spectator, component } = testSetup();

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-shipping-method')).toBeTruthy();
    });
    it('should not render Product Variants section if Product Variant data is not present', () => {
      const { spectator, component } = testSetup();

      product = {
        ...product,
        Variant: [],
      };

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-variant')).toBeFalsy();
    });
    it('should render Product Variants if Product Variant data is present', () => {
      const { spectator, component } = testSetup();

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-variant')).toBeTruthy();
    });
    it('should not render Sizes section if Size data is not present', () => {
      const { spectator, component } = testSetup();

      product = {
        ...product,
        Sizes: '',
      };

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-size')).toBeFalsy();
    });
    it('should render Sizes section if Size data is present', () => {
      const { spectator, component } = testSetup();

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-size')).toBeTruthy();
    });
    it('should not render Imprint methods section if Imprint method data is not present', () => {
      const { spectator, component } = testSetup();

      product = {
        ...product,
        ImprintMethods: '',
      };

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-imprint-method')).toBeFalsy();
    });
    it('should render Imprint methods section if Imprint method data is present', () => {
      const { spectator, component } = testSetup();

      component.product = product;

      spectator.detectComponentChanges();

      expect(spectator.query('.data-jest-imprint-method')).toBeTruthy();
    });
  });
});
