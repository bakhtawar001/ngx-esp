import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { ProductsService } from '@smartlink/products';
import { ProductsMockDb } from '@smartlink/products/mocks';
import { ProductGalleryComponent, ProductGalleryComponentModule } from '.';
import { ProductDetailPage } from '../../pages';

describe('ProductGalleryComponent', () => {
  let spectator: Spectator<ProductGalleryComponent>;
  let component: ProductGalleryComponent;
  const products = ProductsMockDb.products;

  const createComponent = createComponentFactory({
    component: ProductGalleryComponent,
    imports: [
      ProductGalleryComponentModule,
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([
        {
          path: 'products/:id',
          component: ProductDetailPage,
        },
      ]),
    ],
    providers: [mockProvider(ProductsService)],
  });

  beforeEach(() => {
    spectator = createComponent({});
    component = spectator.component;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should display when there are some products', () => {
    component.products = products;
    spectator.detectChanges();
    spectator.detectComponentChanges();
    const relatedEl = spectator.queryAll('.esp-product-gallery--products');
    expect(relatedEl).toBeTruthy();
    expect(relatedEl.length).toBe(1);
  });

  it('should not display when there are no products', () => {
    component.products = [];
    spectator.detectChanges();
    spectator.detectComponentChanges();
    const relatedEl = spectator.query('.esp-product-gallery--products');
    expect(relatedEl).toBeFalsy();
  });

  it('should call click tracking event', () => {
    const productClickedFn = jest
      .spyOn(component.clicked, 'emit')
      .mockReturnValue(null);
    component.products = [...products];
    spectator.detectChanges();
    spectator.detectComponentChanges();
    const relatedEl = spectator.query(
      '.esp-product-gallery--products > cos-product-card'
    );
    expect(relatedEl).toBeTruthy();
    spectator.click(relatedEl);
    expect(productClickedFn).toHaveBeenCalledWith({
      product: products[0],
      index: 0,
    });
  });
});
