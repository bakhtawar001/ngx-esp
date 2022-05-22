import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NgZone } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CosAnalyticsService } from '@cosmos/analytics';
import { CosToastService } from '@cosmos/components/notification';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { ProductsMockDb } from '@smartlink/products/mocks';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { ProductChargesTableComponent } from '../../components/product-charges-table/product-charges-table.component';
import { ProductDetailComponent } from '../../components/product-detail/product-detail.component';
import { ProductImprintMethodsComponent } from '../../components/product-imprint-methods/product-imprint-methods.component';
import { ProductInfoComponent } from '../../components/product-info/product-info.component';
import { ProductInventoryComponent } from '../../components/product-inventory/product-inventory.component';
import { ProductMatrixComponent } from '../../components/product-matrix/product-matrix.component';
import { ProductPricingTableComponent } from '../../components/product-pricing-table/product-pricing-table.component';
import { ProductProductionShippingComponent } from '../../components/product-production-shipping/product-production-shipping.component';
import { ProductSafetyWarningsComponent } from '../../components/product-safety-warnings/product-safety-warnings.component';
import { ProductSpecialsComponent } from '../../components/product-specials/product-specials.component';
import { ProductDetailLocalState } from '../../local-states';
import {
  ProductDetailPage,
  ProductDetailPageModule,
} from './product-detail.page';

describe('ProductDetailPage', () => {
  const createComponent = createComponentFactory({
    component: ProductDetailPage,
    declarations: [
      MockComponents(
        ProductDetailComponent,
        ProductImprintMethodsComponent,
        ProductInfoComponent,
        ProductMatrixComponent,
        ProductPricingTableComponent,
        ProductSafetyWarningsComponent,
        ProductProductionShippingComponent,
        ProductChargesTableComponent,
        ProductInventoryComponent,
        ProductSpecialsComponent
      ),
    ],
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      NgxsModule.forRoot(),

      ProductDetailPageModule,
    ],
    mocks: [CosToastService],
    providers: [
      mockProvider(ProductDetailLocalState, {
        connect: () => of(this),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  const testSetup = (options?: { setSpies?: boolean }) => {
    const spectator = createComponent();
    const router = spectator.inject(Router);
    const zone = spectator.inject(NgZone);

    if (options?.setSpies) {
      const analyticsService = spectator.inject(CosAnalyticsService);
      const fnTrackStatEvent = jest
        .spyOn(analyticsService, 'track')
        .mockImplementation();
      return {
        spectator,
        router,
        zone,
        component: spectator.component,
        spies: { fnTrackStatEvent },
      };
    }

    return { spectator, router, zone };
  };

  it('should create', () => {
    const { spectator } = testSetup();
    expect(spectator).toBeTruthy();
  });

  it('should have back link anchor tag', fakeAsync(() => {
    const { spectator } = testSetup();
    spectator.component.currentNavName = 'Back to Search Results';
    spectator.detectChanges();
    spectator.tick(400);
    const backLinkTag = spectator.query('.back-link');
    expect(backLinkTag).toBeTruthy();
  }));

  it('should track product detail viewed event', () => {
    const { spectator, component, spies } = testSetup({ setSpies: true });
    const product = ProductsMockDb.products[1];
    const stat = {
      action: 'Product Detail Viewed',
      properties: {
        id: product?.Id,
        marketSegmentCode: 'ALL',
        currencyCode: product?.Currency ?? product?.Currencies?.[0],
      },
    };
    spectator.detectChanges();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).capturePageLoadEvent(product);
    expect(spies.fnTrackStatEvent).toHaveBeenCalledWith(stat);
  });
});
