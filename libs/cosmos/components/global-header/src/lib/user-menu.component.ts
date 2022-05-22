import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { MatMenu } from '@angular/material/menu';

import { AuthFacade } from '@esp/auth';

@Component({
  selector: 'cos-user-menu',
  templateUrl: 'user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosUserMenuComponent {
  @Output()
  readonly clientSafeModeChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private _authFacade: AuthFacade) {}

  @ViewChild(MatMenu, { static: true }) menu!: MatMenu;

  toggleClientSafeMode(clientSafeMode: boolean) {
    this.clientSafeModeChanged.emit(clientSafeMode);
  }

  logout(): void {
    this._authFacade.logout();
  }
}
