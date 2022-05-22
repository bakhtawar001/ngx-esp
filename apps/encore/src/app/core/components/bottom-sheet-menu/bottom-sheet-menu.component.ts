import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { DialogService } from '@cosmos/core';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import { AuthFacade } from '@esp/auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, take } from 'rxjs/operators';
import { licenseAgreementDialogDef } from '@asi/ui/feature-core';
import { LogoComponentModule } from '../logo/encore-logo.component';

@UntilDestroy()
@Component({
  selector: 'esp-bottom-sheet-menu',
  templateUrl: './bottom-sheet-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetMenuComponent {
  notifications = 2;
  clientSafeMode = false;

  constructor(
    private _authFacade: AuthFacade,
    private readonly _dialogService: DialogService,
    private readonly _router: Router,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetMenuComponent>
  ) {
    this._router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        take(1),
        untilDestroyed(this)
      )
      .subscribe(() => this._bottomSheetRef.dismiss());
  }

  toggleClientSafeMode(): void {
    this.clientSafeMode = !this.clientSafeMode;
  }

  logout(): void {
    this._authFacade.logout();
  }

  licenseAgreement(): void {
    this._dialogService
      .open(licenseAgreementDialogDef)
      .pipe(untilDestroyed(this))
      .subscribe();
  }
}

@NgModule({
  declarations: [BottomSheetMenuComponent],
  imports: [
    CommonModule,
    RouterModule,

    FeatureFlagsModule,

    MatBadgeModule,
    MatMenuModule,
    MatDividerModule,

    CosSlideToggleModule,

    LogoComponentModule,
  ],
  exports: [BottomSheetMenuComponent],
})
export class BottomSheetMenuComponentModule {}
