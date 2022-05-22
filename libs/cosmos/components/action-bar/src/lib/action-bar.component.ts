import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'cos-action-bar',
  templateUrl: 'action-bar.component.html',
  styleUrls: ['action-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-action-bar',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosActionBarComponent {}

@Component({
  selector: 'cos-action-bar-controls',
  templateUrl: 'action-bar-controls.component.html',
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'cos-action-bar-controls',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosActionBarControlsComponent {
  isDesktop$: Observable<BreakpointState>;
  showMenu = false;

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  onClickedOutside(): void {
    if (this.showMenu) this.showMenu = false;
  }

  constructor(breakpointObserver: BreakpointObserver) {
    this.isDesktop$ = breakpointObserver.observe(['(min-width: 1024px)']);
  }
}
