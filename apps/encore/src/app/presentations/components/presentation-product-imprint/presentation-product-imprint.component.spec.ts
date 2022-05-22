import { createComponentFactory } from '@ngneat/spectator/jest';
import { PresentationProductChargesTableComponentModule } from '..';
import {
  PresentationProductImprintComponent,
  PresentationProductImprintComponentModule,
} from './presentation-product-imprint.component';

describe('PresentationProductImprintComponent', () => {
  const createComponent = createComponentFactory({
    component: PresentationProductImprintComponent,
    imports: [
      PresentationProductImprintComponentModule,
      PresentationProductChargesTableComponentModule,
    ],
    providers: [],
  });

  const testSetup = () => {
    const spectator = createComponent();
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  describe('Imprint Options', () => {
    it("should display the toggle component with correct label as label as 'Imprint Options'", () => {
      //Arrange
      const { spectator, component } = testSetup();
      const toggleEle = spectator.query('cos-toggle');

      //Assert
      expect(toggleEle).toBeVisible();
      expect(toggleEle).toHaveText('Imprint Options');
    });

    it('should display cos-card component imprint options by default', () => {
      //Arrange
      const { spectator, component } = testSetup();

      //Assert
      expect(spectator.query('cos-card')).toExist();
      expect(component.showImprint).toBeTruthy();
    });

    it('should toggle the div when user clicks on toggle button', () => {
      //Arrange
      const { spectator, component } = testSetup();

      //Act
      component.toggleImprint();
      spectator.detectComponentChanges();

      //Assert
      expect(spectator.query('cos-card')).not.toExist();
      expect(component.showImprint).toBeFalsy();

      //Act
      component.toggleImprint();
      spectator.detectComponentChanges();

      //Assert
      expect(component.showImprint).toBeTruthy();
      expect(spectator.query('cos-card')).toExist();
    });

    it("should show the legend with correct label as 'Vendor Imprint Methods'", () => {
      //Arrange
      const { spectator, component } = testSetup();
      const labelEle = spectator.query('fieldset > legend > p');

      //Assert
      expect(labelEle).toExist();
      expect(labelEle).toHaveText('Vendor Imprint Methods');
    });

    it("should show fields with names 'Other Imprint Methods, Imprint Sizes, Imprint Locations, Imprint Colors", () => {
      //Arrange
      const { spectator, component } = testSetup();
      const cosFields = spectator.queryAll(
        'cos-form-field > label > cos-label'
      );

      //Assert
      expect(cosFields[0]).toHaveText('Other Imprint Methods');
      expect(cosFields[1]).toHaveText('Imprint Sizes');
      expect(cosFields[2]).toHaveText('Imprint Locations');
      expect(cosFields[3]).toHaveText('Imprint Colors');
    });

    it("should show 'Imprint Sizes' field with correct placeholder", () => {
      //Arrange
      const { spectator, component } = testSetup();
      const field = spectator.query('input[Name="imprintSizes"]');
      //Assert
      expect(field).toExist();
      expect(field).toHaveAttribute('placeholder', 'Enter sizes');
    });

    it("should show 'Imprint Locations' field with correct placeholder", () => {
      //Arrange
      const { spectator, component } = testSetup();
      const field = spectator.query('input[Name="imprintLocations"]');
      //Assert
      expect(field).toExist();
      expect(field).toHaveAttribute('placeholder', 'Enter locations');
    });

    it("should show 'Imprint Colors' field with correct placeholder", () => {
      //Arrange
      const { spectator, component } = testSetup();
      const field = spectator.query('input[Name="imprintColors"]');
      //Assert
      expect(field).toExist();
      expect(field).toHaveAttribute('placeholder', 'Enter colors');
    });
  });
  describe('Vendor Imprint Charges', () => {
    it('should show card component imprint options by default', () => {
      //Arrange
      const { spectator, component } = testSetup();
      //Assert
      expect(spectator.queryLast('cos-card')).toExist();
      expect(component.showImprint).toBeTruthy();
    });

    it('should display correct title and description', () => {
      //Arrange
      const { spectator, component } = testSetup();

      //Assert
      expect(
        spectator.queryLast(
          '.cos-card-container >.cos-card-body >.cos-card-main > h2'
        )
      ).toExist();
      expect(
        spectator.queryLast(
          '.cos-card-container >.cos-card-body >.cos-card-main > h2'
        )
      ).toHaveText('Add Vendor Imprint Charges');
    });
    it('should display correct icon and description', () => {
      //Arrange
      const { spectator, component } = testSetup();

      //Assert
      expect(
        spectator.queryLast(
          '.cos-card-container >.cos-card-body >.cos-card-main > p > i'
        )
      ).toHaveClass('fa fa-eye-slash');
      expect(
        spectator.queryLast(
          '.cos-card-container >.cos-card-body >.cos-card-main > p'
        )
      ).toHaveText(
        'Available vendor imprint charges are hidden from the customer presentation until they are added'
      );
    });

    it('should display presentation product charges table component', () => {
      const { spectator, component } = testSetup();

      //Assert
      expect(component.showImprint).toBeTruthy();
      expect(
        spectator.query('esp-presentation-product-charges-table')
      ).toExist();
    });
  });
});
