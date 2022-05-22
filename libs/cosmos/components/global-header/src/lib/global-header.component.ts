import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { FeatureFlagsService } from '@cosmos/feature-flags';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

//-----------------------------------------------------------------
// @Cos-Global-Search-Component
//------------------------------------------------------------------
@Component({
  selector: 'cos-global-search',
  template: '<ng-content></ng-content>',
})
export class CosGlobalSearchComponent {}

//----------------------------------------------------------------
// @Cos-Global-Header-Component
//------------------------------------------------------------------

@UntilDestroy()
@Component({
  selector: 'cos-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-global-header',
  },
})
export class CosGlobalHeaderComponent {
  bottomSheetRef: MatBottomSheetRef | null = null;
  bottomSheetOpen = false;

  @Input() ariaLabel: string = '';
  @Input() navItemsDesktop: Array<any> = [];
  @Input() navItemsMobile: Array<any> = [];
  @Input() bottomSheetLogoSrc = '';

  constructor(
    private _bottomSheet: MatBottomSheet,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private featureFlagsService: FeatureFlagsService
  ) {}

  filterByFeatureFlags(navItems: any[]) {
    const isFlagEnabled = this.featureFlagsService.isEnabled.bind(
      this.featureFlagsService
    );
    return (navItems || []).filter((navItem) => {
      const flags = new Array<string>().concat(navItem.featureFlags || []);
      return flags.every(isFlagEnabled);
    });
  }

  openBottomSheet(navItem: any): void {
    if (this.bottomSheetOpen) {
      this.bottomSheetRef?.dismiss();
      return;
    }

    this.renderer.addClass(this.document.body, 'bottom-sheet-open');

    this.bottomSheetRef = this._bottomSheet.open(navItem.component, {
      backdropClass: 'cos-bottom-sheet-backdrop',
      panelClass: 'cos-bottom-sheet-container',
    });

    this.bottomSheetRef
      .afterOpened()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.bottomSheetOpen = true;
      });

    this.bottomSheetRef
      .afterDismissed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.bottomSheetOpen = false;
        this.renderer.removeClass(this.document.body, 'bottom-sheet-open');
      });
  }

  onResize(entry: ResizeObserverEntry) {
    if (!entry.contentRect.width) {
      this._bottomSheet.dismiss();
    }
  }
}
