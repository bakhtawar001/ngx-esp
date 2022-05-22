import { CommonModule, Location } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CosAnalyticsService, TrackEvent } from '@cosmos/analytics';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosRatingsReviewsModule } from '@cosmos/components/ratings-reviews';
import { CosSupplierPageHeaderModule } from '@cosmos/components/supplier-page-header';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import { SupplierDetailViewedEvent } from '@esp/products';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Supplier } from '@smartlink/suppliers';
import { isEqual } from 'lodash-es';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { SupplierLocalState } from '../../local-states';

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-supplier-detail-page',
  templateUrl: './supplier-detail.page.html',
  styleUrls: ['./supplier-detail.page.scss'],
  providers: [SupplierLocalState],
})
export class SupplierDetailPage {
  supplierHeaderLabels = {
    addTo: 'Add to',
    artwork: 'Artwork',
    awards: 'Awards',
    contacts: 'Company Contacts',
    contactInfo: 'Contact Information',
    details: 'Supplier Details',
    email: 'Send a message',
    exceptions: 'Exceptions',
    headquarters: 'Headquarters',
    orders: 'Orders',
    preferredSupplier: 'Preferred Supplier Group',
    preferredPricing: 'Preferred Pricing',
    references: 'Independent Distributor References',
    tollFree: 'Toll Free',
    viewMore: 'View more information',
    viewLess: 'View less information',
    yearEstablished: 'Year Established',
    yearsInIndustry: 'Years in Industry',
    totalEmployees: 'Total Employees',
    qca: 'QCA Certified',
    minorityOwned: 'Minority Owned',
    unionAffiliated: 'Union Affiliated',
    standardProductionTime: 'Standard Production Time',
    rushTime: 'Rush Time',
    functions: 'Functions',
    decoratingMethods: 'Decorating Methods',
    fobPoints: 'FOB/Shipping Point(s)',
    artworkComments: 'Artwork Comments',
    marketingPolicy: 'Marketing Policy',
    distributionPolicy: 'Distribution Policy',
    safetyCompliance: 'Safety and Compliance documents',
    webPages: 'Web Pages',
    notes: 'Notes',
    addANote: 'Add a note',
    true: 'Yes',
    false: 'No',
    productLines: 'Product Lines',
  };

  ratingsCategoryLabels = {
    OverAll: 'Overall',
    Quality: 'Quality',
    Communication: 'Communication',
    Delivery: 'Delivery',
    ConflictResolution: 'Problem Resolution',
    Decoration: 'Imprinting',
  };

  currentNavName: string;
  private readonly state$ = this.state.connect(this);

  constructor(
    public readonly state: SupplierLocalState,
    private _activatedRoute: ActivatedRoute,
    private _location: Location,
    private _route: Router,
    private readonly _analytics: CosAnalyticsService
  ) {
    this._activatedRoute.params.pipe(untilDestroyed(this)).subscribe({
      next: () => this.updatingNavigationName(),
    });

    this.state$
      .pipe(
        debounceTime(200),
        map(({ supplier }) => supplier),
        filter(Boolean),
        distinctUntilChanged(isEqual),
        untilDestroyed(this)
      )
      .subscribe({
        next: (supplier) => {
          this.supplierDetailViewedEvent(supplier);
        },
      });
  }
  goBack(): void {
    this._location.back();
  }

  //-------------------------------------------------------------------------------------------------------------------
  // @Private Methods
  //---------------------------------------------------------------------------------------------------------------------
  private updatingNavigationName(): void {
    this.currentNavName =
      this._route.getCurrentNavigation()?.extras.state?.navigationName;
  }

  private supplierDetailViewedEvent(supplier: Supplier): void {
    const productViewTrackEvent: TrackEvent<SupplierDetailViewedEvent> = {
      action: 'Supplier Detail Viewed',
      properties: {
        id: supplier.Id,
        marketSegmentCode: 'ALL',
      },
    };
    this._analytics.track(productViewTrackEvent);
  }
}

@NgModule({
  declarations: [SupplierDetailPage],
  imports: [
    CommonModule,

    FeatureFlagsModule,

    CosRatingsReviewsModule,
    CosSupplierPageHeaderModule,
    CosButtonModule,
    CosCardModule,
  ],
})
export class SupplierDetailPageModule {}
