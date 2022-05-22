import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgModule,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CosAnalyticsService, TrackEvent } from '@cosmos/analytics';
import { ProductTrackEvent, SourceTrackEvent } from '@esp/products';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Product } from '@smartlink/models';
import { animationFrameScheduler } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { ProductDetailComponentModule } from '../../components/product-detail';
import { ProductDetailLocalState } from '../../local-states';
@UntilDestroy()
@Component({
  selector: 'esp-product-detail-page',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  providers: [ProductDetailLocalState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPage {
  //-------------------------------------------------------------------------------------------------------------------
  // @Private Accessors
  //---------------------------------------------------------------------------------------------------------------------
  private adId: number;
  private referrer: SourceTrackEvent;
  private state$ = this.state.connect(this);

  //-------------------------------------------------------------------------------------------------------------------
  // @Public Accessors
  //---------------------------------------------------------------------------------------------------------------------
  currentNavName: string;

  //-------------------------------------------------------------------------------------------------------------------
  // @Constructor
  //---------------------------------------------------------------------------------------------------------------------
  constructor(
    public readonly state: ProductDetailLocalState,
    private readonly _route: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _location: Location,
    private readonly _analytics: CosAnalyticsService
  ) {
    this._activatedRoute.params.pipe(untilDestroyed(this)).subscribe({
      next: () => this.updatingNavigationName(),
    });

    this.state$
      .pipe(
        map(({ product }) => product),
        filter(Boolean),
        distinctUntilChanged((a, b) => a?.Id === b?.Id),
        debounceTime(1, animationFrameScheduler),
        untilDestroyed(this)
      )
      .subscribe({
        next: (product) => this.capturePageLoadEvent(product),
      });
  }

  //-------------------------------------------------------------------------------------------------------------------
  // @Public Methods
  //---------------------------------------------------------------------------------------------------------------------
  goBack(): void {
    this._location.back();
  }

  //-------------------------------------------------------------------------------------------------------------------
  // @Private Methods
  //---------------------------------------------------------------------------------------------------------------------
  private updatingNavigationName(): void {
    const currentNavigation = this._route.getCurrentNavigation();
    const CPN_REGEXP = new RegExp(/CPN[\s-]?(\d+)$/i);
    const currentKeyword =
      this._activatedRoute.snapshot.queryParamMap.get('keywords');

    this.currentNavName = CPN_REGEXP.test(currentKeyword)
      ? 'Back'
      : currentNavigation?.extras.state?.navigationName;

    this.adId = currentNavigation?.extras.state?.adId;
    this.referrer = currentNavigation?.extras.state?.referrer;
  }

  private capturePageLoadEvent(product: Product): void {
    const ad = this.adId ? { id: this.adId } : undefined;
    const pageViewEvent: TrackEvent<ProductTrackEvent> = {
      action: 'Product Detail Viewed',
      properties: {
        id: product?.Id,
        ad,
        marketSegmentCode: 'ALL',
        currencyCode: product?.Currency ?? product?.Currencies?.[0],
        referrer: this.referrer,
      },
    };

    this._analytics.track(pageViewEvent);
  }
}

@NgModule({
  declarations: [ProductDetailPage],
  imports: [CommonModule, ProductDetailComponentModule],
})
export class ProductDetailPageModule {}
