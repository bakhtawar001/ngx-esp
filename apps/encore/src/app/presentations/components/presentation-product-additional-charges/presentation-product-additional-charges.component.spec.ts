import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  PresentationProductAdditionalChargesComponent,
  PresentationProductAdditionalChargesComponentModule,
} from './presentation-product-additional-charges.component';

const charges = [
  {
    chargename: 'test chargename1',
    chargeqty: '11',
    price: '12.95',
  },
  {
    chargename: 'test chargename2',
    chargeqty: '8',
    price: '15.95',
  },
  {
    chargename: 'test chargename3',
    chargeqty: '9',
    price: '20.55',
  },
];

describe('PresentationProductAdditionalChargesComponent', () => {
  const createComponent = createComponentFactory({
    component: PresentationProductAdditionalChargesComponent,
    imports: [PresentationProductAdditionalChargesComponentModule],
    providers: [],
  });

  const testSetup = () => {
    const spectator = createComponent();
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it("should display the toggle component with correct label as 'Additional Charges'", () => {
    // Arrange
    const { spectator } = testSetup();
    const toggleElem = spectator.query('.cos-slide-toggle');

    // Assert
    expect(toggleElem).toBeVisible();
    expect(spectator.query('label.cos-slide-toggle-label')).toHaveText(
      'Additional Charges'
    );
  });

  it("should display the 'Add a custom charge' button along with '+' icon", () => {
    // Arrange
    const { spectator } = testSetup();
    const chargeAddBtn = spectator.query('.presentation-product-btn');
    const chargeAddBtnIcon = spectator.query('.presentation-product-btn > i');

    // Assert
    expect(chargeAddBtn).toBeVisible();
    expect(chargeAddBtnIcon).toHaveClass('fa fa-plus');
    expect(chargeAddBtn).toHaveDescendant(chargeAddBtnIcon);
    expect(chargeAddBtn).toHaveText('Add a custom charge');
  });

  it('should display the Product Charges table', () => {
    // Arrange
    const { spectator } = testSetup();
    const productChargesTable = spectator.query(
      'esp-presentation-product-charges-table'
    );

    // Assert
    expect(productChargesTable).toBeVisible();
  });

  describe('Charges table', () => {
    it("should show the 'Charge Name' table header", () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.charges = charges;
      spectator.detectComponentChanges();
      const chargeTblRows = spectator.queryAll('.cos-table');
      const chargeNameHeader =
        chargeTblRows[0].children[0].children[0].children[0];

      // Assert
      expect(chargeNameHeader).toHaveText('Charge Name');
      expect(chargeNameHeader.tagName).toBe('TH');
    });
  });
});
