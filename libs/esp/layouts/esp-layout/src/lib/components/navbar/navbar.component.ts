import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ReactiveComponent } from '@cosmos/common';
import { CosmosConfigService } from '@cosmos/core';
import { SidebarService } from '@cosmos/layout';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'esp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent extends ReactiveComponent {
  get config() {
    return this.state.config;
  }

  /**
   * Constructor
   *
   * @param {SidebarService} _sidebarService
   * @param {Router} _router
   */
  constructor(
    private _configService: CosmosConfigService,
    private _sidebarService: SidebarService,
    private _router: Router
  ) {
    super();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------
  private get _sidebar() {
    return this._sidebarService.getSidebar('navbar');
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar opened status
   */
  toggleSidebarOpened(): void {
    this._sidebar.toggleOpen();
  }

  /**
   * Toggle sidebar folded status
   */
  toggleSidebarFolded(): void {
    this._sidebar.toggleFold();
  }

  protected override setState() {
    const navigationChange = this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      tap(() => this._sidebar.close())
    );

    this.state = this.connect({
      config: this._configService.config$,
      navigationChanges: navigationChange,
    });
  }
}
