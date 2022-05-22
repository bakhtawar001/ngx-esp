import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  NgModule,
} from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs/operators';

import { CosButtonModule } from '@cosmos/components/button';
import {
  CosToastService,
  ToastConfig,
  ToastData,
} from '@cosmos/components/notification';

@Component({
  selector: 'esp-notification-button-refresh',
  template: `
    <button cos-flat-button color="primary" type="button" (click)="refresh()">
      Refresh
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-top: 8px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefreshButtonComponent {
  refresh() {
    window.location.reload();
  }
}

@NgModule({
  imports: [CosButtonModule],
  declarations: [RefreshButtonComponent],
})
export class RefreshButtonComponentModule {}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class SwUpdateService {
  constructor(
    private readonly _swUdate: SwUpdate,
    private readonly _toastService: CosToastService
  ) {}

  checkForUpdates() {
    const updatesAvailable$ = this._swUdate.versionUpdates.pipe(
      filter(
        (event): event is VersionReadyEvent => event.type === 'VERSION_READY'
      ),
      map((event) => ({
        type: 'UPDATE_AVAILABLE',
        current: event.currentVersion,
        available: event.latestVersion,
      }))
    );

    updatesAvailable$
      .pipe(untilDestroyed(this))
      .subscribe(() => this._showToast());
  }

  private _showToast() {
    const data: ToastData = {
      title: 'Update available',
      body: 'A new version is available. Please reload the page to activate it.',
      type: 'info',
      component: RefreshButtonComponent,
    };

    const config: ToastConfig = {
      autoClose: false,
      dismissible: true,
      position: 'top-center',
    };

    this._toastService.showToast(data, config);
  }
}
