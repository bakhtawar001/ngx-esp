import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  ProductInventoryDialog,
  ProductInventoryDialogModule,
} from './product-inventory.dialog';

const inventory = [
  {
    Value: 755,
    Label: '755',
    PartCode: '168-1262-001',
    PartDescription:
      'OTTO CAP "OTTO SNAP" 6 Panel Mid Profile Snapback Hat (001 - Royal) (OSFM - Adult) (Color 001 - Royal) (Size OSFM - Adult)',
    Location: 'Test Location',
  },
  {
    Value: 756,
    Label: '756',
    PartCode: '168-1262-002',
    PartDescription:
      'OTTO CAP "OTTO SNAP" 6 Panel Mid Profile Snapback Hat (001 - Royal) (OSFM - Adult) (Color 001 - Royal) (Size OSFM - Adult) Test',
  },
];

describe('ProductInventoryDialog', () => {
  let spectator: Spectator<ProductInventoryDialog>;

  const createComponent = createComponentFactory({
    component: ProductInventoryDialog,
    imports: [ProductInventoryDialogModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: { inventory } },
      { provide: MatDialogRef, useValue: {} },
    ],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  it('should show correct table headers', () => {
    const tableElement = spectator.query('.product-inventory-modal');
    const tableHeader = tableElement.querySelectorAll('.cos-header-cell');
    expect(tableHeader[0].textContent).toContain('Part Code');
    expect(tableHeader[1].textContent).toContain('Description');
    expect(tableHeader[2].textContent).toContain('Quantity');
    expect(tableHeader[3].textContent).toContain('Location');
  });

  it('should show correct table content with PartCode, Description, Quantity, Location', () => {
    const tableElement = spectator.query('.product-inventory-modal');
    const tableCells = tableElement.querySelectorAll('.cos-cell');
    expect(tableCells[0]).toHaveText(inventory[0].PartCode);
    expect(tableCells[1]).toHaveText(inventory[0].PartDescription);
    expect(tableCells[2]).toHaveText(inventory[0].Label);
    expect(tableCells[3]).toHaveText(inventory[0].Location);
    expect(tableCells[4]).toHaveText(inventory[1].PartCode);
    expect(tableCells[5]).toHaveText(inventory[1].PartDescription);
    expect(tableCells[6]).toHaveText(inventory[1].Label);
    expect(tableCells[7]).toHaveText('N/A');
  });

  it('should show correct header for Inventory', () => {
    expect('.mat-dialog-title').toContainText('Inventory Grid');
  });
});
