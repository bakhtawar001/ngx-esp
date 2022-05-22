import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewChild,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { DialogService } from '@cosmos/core';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import { AuthFacade } from '@esp/auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { licenseAgreementDialogDef } from '../../dialogs';

@UntilDestroy()
@Component({
  selector: 'asi-user-menu',
  templateUrl: 'user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiUserMenuComponent {
  clientSafeMode = false;

  @ViewChild(MatMenu, { static: true }) menu: MatMenu;

  constructor(
    private readonly _authFacade: AuthFacade,
    private readonly _dialogService: DialogService
  ) {}

  toggleClientSafeMode(): void {
    this.clientSafeMode = !!this.clientSafeMode;
  }

  licenseAgreement(): void {
    this._dialogService
      .open(licenseAgreementDialogDef)
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  logout(): void {
    this._authFacade.logout();
  }
}

@NgModule({
  declarations: [AsiUserMenuComponent],
  imports: [
    RouterModule,

    FeatureFlagsModule,

    MatMenuModule,
    MatDividerModule,

    CosSlideToggleModule,
  ],
  exports: [AsiUserMenuComponent],
})
export class AsiUserMenuComponentModule {}
