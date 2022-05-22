import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CosAnalyticsService } from '@cosmos/analytics';
import { AdTrackEvent, Product as TrackProduct } from '@esp/products';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { ProductsService } from '@smartlink/products';
import { ProductsMockDb } from '@smartlink/products/mocks';
import { ProductDetailPage } from '../../pages';
import { getAdInfo } from '../../utils';
import {
  ProductRelatedComponent,
  ProductRelatedComponentModule,
} from './product-related.component';

describe('ProductRelatedComponent', () => {
  const products = ProductsMockDb.products;
  const createComponent = createComponentFactory({
    component: ProductRelatedComponent,
    imports: [
      ProductRelatedComponentModule,
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

  const testSetup = (options?: { setSpies?: boolean }) => {
    const spectator = createComponent();
    spectator.component.sourceProduct = products[0];

    if (options?.setSpies) {
      const analyticsService = spectator.inject(CosAnalyticsService);
      const fnTrackStatEvent = jest
        .spyOn(analyticsService, 'track')
        .mockImplementation();
      return {
        spectator,
        component: spectator.component,
        spies: { fnTrackStatEvent },
      };
    }

    return {
      spectator,
      component: spectator.component,
    };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    const { spectator, component } = testSetup();
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should display when there are some products', () => {
    const { spectator, component } = testSetup();
    component.products = products;
    spectator.detectChanges();
    const relatedEl = spectator.query('esp-product-gallery');
    expect(relatedEl).toBeTruthy();
  });

  it('should not display when there are no products', () => {
    const { spectator, component } = testSetup();
    component.products = [];
    spectator.detectChanges();
    const relatedEl = spectator.query('esp-product-gallery');
    expect(relatedEl).toBeFalsy();
  });

  it('should track related product card clicked event', () => {
    const { spectator, component, spies } = testSetup({ setSpies: true });
    component.type = 'related';
    const product = products[1];
    product.Ad = { Id: 1, Index: 0, LevelId: 1 };
    const stat = {
      action: 'Product Clicked',
      properties: {
        id: product.Id,
        ad: getAdInfo(product.Ad),
        source: {
          id: component.sourceProduct.Id,
          component: 'Related Products',
        },
        productIndex:
          products.findIndex((p) => {
            return p.Id === product.Id;
          }) + 1,
        currencyCode: product.Price?.CurrencyCode,
      },
    };

    spectator.detectComponentChanges();
    component.productCardClicked({
      product,
      index: products.findIndex((p) => {
        return p.Id === product.Id;
      }),
    });
    expect(spies.fnTrackStatEvent).toHaveBeenCalledWith(stat);
  });

  it('should track more from supplier product card clicked event', () => {
    const { spectator, component, spies } = testSetup({ setSpies: true });
    component.type = 'supplier';
    const product = products[1];
    product.Ad = null;
    const stat = {
      action: 'Product Clicked',
      properties: {
        id: product.Id,
        ad: undefined,
        source: {
          id: component.sourceProduct.Id,
          component: 'More from Supplier',
        },
        productIndex:
          products.findIndex((p) => {
            return p.Id === product.Id;
          }) + 1,
        currencyCode: product.Price?.CurrencyCode,
      },
    };

    spectator.detectComponentChanges();
    component.productCardClicked({
      product,
      index: products.findIndex((p) => {
        return p.Id === product.Id;
      }),
    });
    expect(spies.fnTrackStatEvent).toHaveBeenCalledWith(stat);
  });

  it('should track trending in category product card clicked event', () => {
    const { spectator, component, spies } = testSetup({ setSpies: true });
    component.type = 'category';
    const product = products[1];
    product.Ad = null;
    const stat = {
      action: 'Product Clicked',
      properties: {
        id: product.Id,
        ad: undefined,
        source: {
          id: component.sourceProduct.Id,
          component: 'Trending in Category',
        },
        productIndex:
          products.findIndex((p) => {
            return p.Id === product.Id;
          }) + 1,
        currencyCode: product.Price?.CurrencyCode,
      },
    };

    spectator.detectComponentChanges();
    component.productCardClicked({
      product,
      index: products.findIndex((p) => {
        return p.Id === product.Id;
      }),
    });
    expect(spies.fnTrackStatEvent).toHaveBeenCalledWith(stat);
  });

  it('should track related product list viewed event', () => {
    const { spectator, component, spies } = testSetup({ setSpies: true });
    component.type = 'related';
    const relatedProducts = products.slice(1, 9);
    relatedProducts.forEach((p, i) => {
      if (i % 2 !== 0) {
        p.Ad = {
          Id: i + 1,
          Index: i,
          LevelId: i + 1,
        };
      }
    });

    const productList: TrackProduct[] = relatedProducts.map(
      (product, index) => {
        const ad: AdTrackEvent = getAdInfo(product.Ad);
        return {
          id: product.Id,
          index: index + 1,
          ad,
          currencyCode: product.Price?.CurrencyCode,
        };
      }
    );

    const stat = {
      action: 'Product List Viewed',
      properties: {
        products: productList,
        source: {
          id: component.sourceProduct.Id,
          component: 'Related Products',
        },
      },
    };

    spectator.detectComponentChanges();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).productListViewEvent(relatedProducts);
    expect(spies.fnTrackStatEvent).toHaveBeenCalledWith(stat);
  });

  it('should track more from supplier product list viewed event', () => {
    const { spectator, component, spies } = testSetup({ setSpies: true });
    component.type = 'supplier';
    const supplierProducts = products.slice(1, 5);
    supplierProducts.forEach((p) => (p.Ad = null));
    const productList: TrackProduct[] = supplierProducts.map(
      (product, index) => {
        return {
          id: product.Id,
          index: index + 1,
          currencyCode: product.Price?.CurrencyCode,
        };
      }
    );

    const stat = {
      action: 'Product List Viewed',
      properties: {
        products: productList,
        source: {
          id: component.sourceProduct.Id,
          component: 'More from Supplier',
        },
      },
    };

    spectator.detectComponentChanges();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).productListViewEvent(supplierProducts);
    expect(spies.fnTrackStatEvent).toHaveBeenCalledWith(stat);
  });

  it('should track trending in category product list viewed event', () => {
    const { spectator, component, spies } = testSetup({ setSpies: true });
    component.type = 'category';
    const categoryProducts = products.slice(1, 5);
    categoryProducts.forEach((p) => (p.Ad = null));
    const productList: TrackProduct[] = categoryProducts.map(
      (product, index) => {
        return {
          id: product.Id,
          index: index + 1,
          currencyCode: product.Price?.CurrencyCode,
        };
      }
    );

    const stat = {
      action: 'Product List Viewed',
      properties: {
        products: productList,
        source: {
          id: component.sourceProduct.Id,
          component: 'Trending in Category',
        },
      },
    };

    spectator.detectComponentChanges();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).productListViewEvent(categoryProducts);
    expect(spies.fnTrackStatEvent).toHaveBeenCalledWith(stat);
  });
});
