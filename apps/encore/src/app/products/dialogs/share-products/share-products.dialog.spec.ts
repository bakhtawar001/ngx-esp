import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import * as faker from 'faker';
import {
  ShareProductsDialog,
  ShareProductsDialogModule,
} from './share-products.dialog';

const products = [
  {
    Id: 0,
    Name: faker.commerce.productName(),
    Number: '',
    ImageUrl: faker.image.imageUrl(),
    Images: [faker.image.imageUrl()],
    Supplier: null,
    VariantTag: '',
    Price: {
      Quantity: 10,
      Price: 20,
      Cost: 10,
      DiscountCode: 'DISC',
      CurrencyCode: 'USD',
      PreferredPrice: 12,
      PreferredPriceText: 'Preferred price',
    },
    IsAd: false,
    AttributeTags: [],
  },
];

describe('ShareProductsDialog', () => {
  let spectator: Spectator<ShareProductsDialog>;

  const createComponent = createComponentFactory({
    component: ShareProductsDialog,
    imports: [ShareProductsDialogModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: { products } },
      { provide: MatDialogRef, useValue: {} },
    ],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
