import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { InventoryQuantity } from '@smartlink/models';
import {
  ProductInventoryComponent,
  ProductInventoryComponentModule,
} from './product-inventory.component';

describe('ProductInventoryComponent', () => {
  let inventory: InventoryQuantity[];

  let spectator: Spectator<ProductInventoryComponent>;
  let component: ProductInventoryComponent;

  const createComponent = createComponentFactory({
    component: ProductInventoryComponent,
    imports: [ProductInventoryComponentModule],
  });

  beforeEach(() => {
    inventory = [
      {
        Value: 755,
        Label: '755',
        Location: 'Test Location',
        PartCode: '168-1262-001',
        PartDescription:
          'OTTO CAP "OTTO SNAP" 6 Panel Mid Profile Snapback Hat (001 - Royal) (OSFM - Adult) (Color 001 - Royal) (Size OSFM - Adult)',
      },
    ];

    spectator = createComponent({
      props: {
        inventory,
      },
    });

    component = spectator.component;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  it('should not show component if inventory does not exist', () => {
    component.inventory = null;
    spectator.detectChanges();

    expect(
      spectator.query('.product-inventory .product-inventory-quantity')
    ).not.toExist();
  });

  it('should show product code and part description in dropdown', () => {
    const productOptions = spectator.queryAll('.product-inventory-options');
    const quantities = inventory[0];
    expect(productOptions[0]).toHaveText(quantities.PartCode);
    expect(productOptions[0]).toHaveText(quantities.PartDescription);
  });

  it('should show correct data - If Description is missing, then do not display the missing field', () => {
    component.inventory = [
      {
        Value: 11,
        Label: 'label',
        PartCode: 'partcode',
      },
    ];
    spectator.detectChanges();

    const productOptions = spectator.queryAll('.product-inventory-options');
    const quantities = component.inventory[0];
    expect(productOptions[0]).toHaveText(quantities.PartCode);
  });

  it('should show correct data - If partcode  is missing, then do not display the missing field', () => {
    component.inventory = [
      {
        Value: 11,
        Label: 'label',
        PartDescription: 'description',
      },
    ];
    spectator.detectChanges();

    const productOptions = spectator.queryAll('.product-inventory-options');
    const quantities = component.inventory[0];
    expect(productOptions[0]).toHaveText(quantities.PartDescription);
  });

  // TODO: Code for showing items in assecnding order not present
  // it('should display values sorted by partcode in dropdown', () => {
  //   inventory.Quantities = [
  //     {
  //       Value: 11,
  //       Label: "label",
  //       PartCode: "168-1262-002",
  //       PartDescription: "description",
  //     },
  //     {
  //       Value: 10,
  //       Label: "a label",
  //       PartCode: "168-1262-001",
  //       PartDescription: "a description",
  //     }
  //   ]
  //   host.detectChanges();
  //   const productOptions = host.queryAll('.product-inventory-options');
  //   const quantities = inventory[1];
  //   expect(productOptions[0]).toHaveText(quantities.PartCode);
  //   expect(productOptions[0]).toHaveText(quantities.PartDescription);
  // });

  it('should show total available quantity', () => {
    const productQuantity = spectator.query(
      '.product-inventory-quantity > .product-inventory-quantity-value'
    );
    expect(productQuantity).toHaveText(inventory[0].Label);
  });

  it('By default first value should be selected in the drop down with relevant quantity', () => {
    const value = spectator.component.selectedInventory;
    expect(value).toBe(inventory[0]);
    const productQuantity = spectator.query(
      '.product-inventory-quantity > .product-inventory-quantity-value'
    );
    expect(productQuantity).toHaveText(inventory[0].Label);
  });
});
