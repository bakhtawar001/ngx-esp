import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  ProductSpecialsComponent,
  ProductSpecialsComponentModule,
} from './product-specials.component';

const specials = [
  {
    Code: 'code',
    CurrencyCode: 'CurrencyCode',
    DateDisplay: 'DateDisplay',
    Description: 'Description',
    Discount: 10,
    DiscountUnit: 'DiscountUnit',
    FromDate: 'FromDate',
    Id: 1,
    ImageUrl: 'ImageUrl',
    Name: 'Name',
    ThroughDate: '11/27/20',
    Type: 'Type',
    TypeCode: 'TypeCode',
    TypeDescription: 'TypeDescription',
  },
];

describe('ProductSpecialsComponent', () => {
  let spectator: Spectator<ProductSpecialsComponent>;
  let component: ProductSpecialsComponent;

  const createComponent = createComponentFactory({
    component: ProductSpecialsComponent,
    imports: [ProductSpecialsComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        specials,
      },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  it('should not show header', () => {
    component.specials = [];
    spectator.detectChanges();

    expect('.product-specials-header').not.toExist();
  });

  it('should get decoded html', () => {
    const htmlElement = `<a href="https://example.com">Link</a>`;

    expect(component.htmlDecode(htmlElement)).toBe('Link');
  });

  it('should show correct promo code', () => {
    expect('.special-promoCode').toContainText(component.specials[0].Code);
  });

  it('should not show correct promo code', () => {
    delete component.specials[0].Code;
    spectator.detectChanges();

    expect('.special-promoCode').not.toExist();
  });

  it('should show correct description', () => {
    expect('.special-description').toContainText(
      component.specials[0].Description
    );
  });

  it('should show correct discount %', () => {
    expect('.special-discount').toContainText(
      component.specials[0].Discount.toString()
    );
  });

  it('should show currency off', () => {
    expect('.special-discount').toContainText(
      component.specials[0].CurrencyCode
    );
  });

  it('should show Flyer information', () => {
    expect(spectator.query('.flyer')).toBeTruthy();
    expect(spectator.query('.flyer > a')).toHaveAttribute(
      'href',
      component.htmlDecode(specials[0].ImageUrl)
    );
  });

  it('should not show Flyer information', () => {
    component.specials[0].ImageUrl = null;
    spectator.detectComponentChanges();
    expect(spectator.query('.flyer')).toBeFalsy();
  });
});
