import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosProductGalleryComponent } from './product-gallery.component';
import { CosProductGalleryModule } from './product-gallery.module';

const products = [
  {
    Id: 5443047,
    Name: 'White Barrel European Design Ballpoint Pen',
    Number: 'FLWR-E',
    ImageUrl: 'media/22624610',
    VariantTag: null,
    Supplier: {
      Id: 3307,
      Name: 'Graphco line',
      AsiNumber: '57956',
      Preferred: {
        Name: 'Gold',
      },
      Rating: {
        Rating: 10,
        Companies: 12,
        Transactions: 12,
      },
    },
    Price: {
      Quantity: 200,
      Price: 0.53,
      Cost: 0.318,
      DiscountCode: 'R',
      CurrencyCode: 'USD',
      PreferredPrice: 0.25,
    },
    IsAd: true,
    AttributeTags: [
      {
        Icon: 'exclamation-triangle',
        Label: 'Prop65/Hazard',
      },
    ],
  },
  {
    Id: 5443048,
    Name: 'White Barrel European Design Ballpoint Pen',
    Number: 'FLWR-E',
    ImageUrl: 'media/22624610',
    VariantTag: null,
    Supplier: {
      Id: 3307,
      Name: 'Graphco line',
      AsiNumber: '57956',
      Preferred: {
        Name: 'Gold',
      },
      Rating: {
        Rating: 10,
        Companies: 12,
        Transactions: 12,
      },
    },
    Price: {
      Quantity: 200,
      Price: 0.53,
      Cost: 0.318,
      DiscountCode: 'R',
      CurrencyCode: 'USD',
      PreferredPrice: 0.25,
    },
    IsAd: true,
    AttributeTags: [
      {
        Icon: 'exclamation-triangle',
        Label: 'Prop65/Hazard',
      },
    ],
  },
  {
    Id: 5443049,
    Name: 'White Barrel European Design Ballpoint Pen',
    Number: 'FLWR-E',
    ImageUrl: 'media/22624610',
    VariantTag: null,
    Supplier: {
      Id: 3307,
      Name: 'Graphco line',
      AsiNumber: '57956',
      Preferred: {
        Name: 'Gold',
      },
      Rating: {
        Rating: 10,
        Companies: 12,
        Transactions: 12,
      },
    },
    Price: {
      Quantity: 200,
      Price: 0.53,
      Cost: 0.318,
      DiscountCode: 'R',
      CurrencyCode: 'USD',
      PreferredPrice: 0.25,
    },
    IsAd: true,
    AttributeTags: [
      {
        Icon: 'exclamation-triangle',
        Label: 'Prop65/Hazard',
      },
    ],
  },
  {
    Id: 5443050,
    Name: 'White Barrel European Design Ballpoint Pen',
    Number: 'FLWR-E',
    ImageUrl: 'media/22624610',
    VariantTag: null,
    Supplier: {
      Id: 3307,
      Name: 'Graphco line',
      AsiNumber: '57956',
      Preferred: {
        Name: 'Gold',
      },
      Rating: {
        Rating: 10,
        Companies: 12,
        Transactions: 12,
      },
    },
    Price: {
      Quantity: 200,
      Price: 0.53,
      Cost: 0.318,
      DiscountCode: 'R',
      CurrencyCode: 'USD',
      PreferredPrice: 0.25,
    },
    IsAd: true,
    AttributeTags: [
      {
        Icon: 'exclamation-triangle',
        Label: 'Prop65/Hazard',
      },
    ],
  },
];

const props = {
  heading: 'Similar Products',
  galleryIcon: 'https://commonmedia.asicentral.com/supplierlogos/7730/logo.png',
  description: 'A collection of similar products',
  products,
};

describe('CosProductGallery', () => {
  let component: CosProductGalleryComponent;
  let spectator: Spectator<CosProductGalleryComponent>;

  const createComponent = createComponentFactory({
    component: CosProductGalleryComponent,
    imports: [CosProductGalleryModule],
  });

  beforeEach(() => {
    spectator = createComponent({ props });
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.query('.cos-product-gallery')).toBeTruthy();
  });
});
