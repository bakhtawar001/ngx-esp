import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveComponent } from '@cosmos/common';
import { CosmosConfigService } from '@cosmos/core';
import { SidebarService } from '@cosmos/layout';
import { AuthFacade } from '@esp/auth';

@Component({
  selector: 'esp-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent extends ReactiveComponent {
  get config() {
    return this.state.config;
  }

  languages: any[];

  @ViewChild('searchKeyword', { static: true }) searchKeyword: ElementRef;

  /**
   * Constructor
   *
   * @param {LayoutFacade} _configService
   * @param {SidebarService} _sidebarService
   * @param {AuthFacade} _authFacade
   * @param {Router}
   */
  constructor(
    private _configService: CosmosConfigService,
    private _sidebarService: SidebarService,
    private _authFacade: AuthFacade,
    private _router: Router
  ) {
    super();
  }

  get user() {
    return this._authFacade.user;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  logout() {
    this._authFacade.logout();
  }

  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebarOpen(key): void {
    const sidebar = this._sidebarService.getSidebar(key);

    if (sidebar) {
      sidebar.toggleOpen();
    }
  }

  /**
   * Search
   *
   * @param value
   */
  search(value: string): void {
    this._router.navigate(['/products'], {
      queryParams: { q: value },
    });
  }

  /**
   * Set the language
   *
   * @param lang
   */
  setLanguage(lang: any): void {
    // // Set the selected language for the toolbar
    // this.selectedLanguage = lang;
    // // Use the selected language for translations
    // this._translateService.use(lang.id);
  }

  protected override setState() {
    this.state = this.connect({
      config: this._configService.config$,
    });
  }
}
