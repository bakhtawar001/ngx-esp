import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, take } from 'rxjs/operators';

import { AuthFacade } from '@esp/auth';

@UntilDestroy()
@Component({
  selector: 'cos-bottom-menu',
  templateUrl: 'bottom-menu.component.html',
})
export class CosBottomMenuComponent {
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<CosBottomMenuComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _authFacade: AuthFacade,
    private _router: Router
  ) {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
        untilDestroyed(this)
      )
      .subscribe(() => this._bottomSheetRef.dismiss());
  }

  @Output()
  readonly clientSafeModeChanged = new EventEmitter<MouseEvent>();

  toggleClientSafeMode(event: MouseEvent) {
    this.clientSafeModeChanged.emit(event);
  }

  logout(): void {
    this._authFacade.logout();
  }

  // Use _bottomSheetRef to call methods on the sheet, like
  // this._bottomSheetRef.dismiss()
}
