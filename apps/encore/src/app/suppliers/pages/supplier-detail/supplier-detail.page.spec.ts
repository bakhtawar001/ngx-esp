import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CosAnalyticsService, TrackEvent } from '@cosmos/analytics';
import { CosCardComponent } from '@cosmos/components/card';
import { CosRatingsReviewsComponent } from '@cosmos/components/ratings-reviews';
import { CosSupplierPageHeaderComponent } from '@cosmos/components/supplier-page-header';
import { SupplierDetailViewedEvent } from '@esp/products';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { SmartlinkSuppliersModule } from '@smartlink/suppliers';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { SupplierLocalState } from '../../local-states';
import {
  SupplierDetailPage,
  SupplierDetailPageModule,
} from './supplier-detail.page';

describe('SupplierDetailPage', () => {
  let spectator: Spectator<SupplierDetailPage>;
  let component: SupplierDetailPage;

  const createComponent = createComponentFactory({
    component: SupplierDetailPage,
    declarations: [
      MockComponents(
        CosSupplierPageHeaderComponent,
        CosRatingsReviewsComponent,
        CosCardComponent
      ),
    ],
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      SmartlinkSuppliersModule,
      SupplierDetailPageModule,
      RouterTestingModule,
    ],
    providers: [
      mockProvider(SupplierLocalState, {
        connect: () => of(this),
        ratings: () => of(null),
      }),
    ],
  });

  beforeEach(() => {
    try {
      spectator = createComponent({
        providers: [
          mockProvider(SupplierLocalState, <Partial<SupplierLocalState>>{
            connect() {
              return of(this);
            },
            supplier: {
              Id: 1,
              Name: 'ASI Corporate',
              AsiNumber: '125724',
            },
          }),
        ],
      });
      component = spectator.component;
    } catch (error) {
      console.log('host creation failed', error);
    }
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  it('should show a card with rate this supplier when no ratings exist', () => {
    const button = spectator.query('.supplier-ratings-none button');
    expect(spectator.query('.supplier-ratings-none p')).toHaveText(
      'No ratings for this supplier yet'
    );
    expect(button).toBeVisible();
  });

  it('should have back link anchor tag', () => {
    component.currentNavName = 'Back to Search Results';
    spectator.detectChanges();
    const backLinkTag = spectator.query('.back-link');
    expect(backLinkTag).toBeTruthy();
  });

  it('Supplier Detail Viewed event should trigger', () => {
    const analyticsService = spectator.inject(CosAnalyticsService, true);
    const fnTrackStatEvent = jest
      .spyOn(analyticsService, 'track')
      .mockImplementation();

    const stat: TrackEvent<SupplierDetailViewedEvent> = {
      action: 'Supplier Detail Viewed',
      properties: {
        id: component.state.supplier.Id,
        marketSegmentCode: 'ALL',
      },
    };
    expect(fnTrackStatEvent).toHaveBeenCalledWith(stat);
  });
});
