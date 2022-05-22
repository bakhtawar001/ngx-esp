import { A11yModule } from '@angular/cdk/a11y';
import { ComponentPortal, Portal, PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, NgModule, NgZone } from '@angular/core';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { CosAnalyticsService } from '@cosmos/analytics';
import { CosFiltersModule } from '@cosmos/components/filters';
import { CosGlobalHeaderModule } from '@cosmos/components/global-header';
import { CosPaginationModule } from '@cosmos/components/pagination';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { CosmosLayoutModule } from '@cosmos/layout';
import { AuthFacade } from '@esp/auth';
import { EncoreLayoutModule } from '@esp/layouts/encore-layout';
import { RouterFacade } from '@esp/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged } from 'rxjs/operators';
import { navItemsDesktop, navItemsMobile } from '../../configs';
import { SwUpdateService } from '../../services/sw-update.service';
import { BottomSheetMenuComponentModule } from '../bottom-sheet-menu/bottom-sheet-menu.component';
import { FooterComponentModule } from '../footer/footer.component';
import { GlobalSearchComponentModule } from '../global-search/global-search.component';
import { LogoComponentModule } from '../logo/encore-logo.component';

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-app-root',
  templateUrl: './app-root.component.html',
  styleUrls: ['./app-root.component.scss'],
})
export class AppRootComponent {
  hideGlobalSearch = false;
  navItemsDesktop = navItemsDesktop;
  navItemsMobile = navItemsMobile;
  collectionsMenuPortal: Portal<any>;
  userMenuPortal: Portal<any>;
  projectsMenuPortal: Portal<any>;

  constructor(
    private readonly _ngZone: NgZone,
    private readonly _router: Router,
    private readonly _routerFacade: RouterFacade,
    private readonly _authFacade: AuthFacade,
    private readonly _analytics: CosAnalyticsService,
    private readonly _swUpdate: SwUpdateService
  ) {
    this._routerFacade.data$
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.hideGlobalSearch = data?.hideGlobalSearch));

    this.loadCollectionsMenu();
    this.loadUsersMenu();
    this.loadProjectsMenu();
    this.setupAnalyticsUserEventListener();
    this._swUpdate.checkForUpdates();
  }

  menuLoaded(ref, id): void {
    const menuItem = this.navItemsDesktop.find((item) => item.id === id);

    if (menuItem) {
      menuItem.menu = ref.instance.menu;
    }
  }

  navigateByUrl(url: string): void {
    // Caretaker note: this method is used for e2e tests
    this._ngZone.run(() => {
      this._router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => this._router.navigateByUrl(url));
    });
  }

  async loadCollectionsMenu(): Promise<void> {
    const { CollectionsMenuComponent } = await import(
      '../../../collections/components/collections-menu/collections-menu.component'
    );

    this.collectionsMenuPortal = new ComponentPortal(CollectionsMenuComponent);
  }

  async loadUsersMenu(): Promise<void> {
    const { AsiUserMenuComponent } = await import('@asi/ui/feature-core');

    this.userMenuPortal = new ComponentPortal(AsiUserMenuComponent);
  }

  async loadProjectsMenu(): Promise<void> {
    const { ProjectsMenuComponent } = await import(
      '../../../projects/components/projects-menu/projects-menu.component'
    );

    this.projectsMenuPortal = new ComponentPortal(ProjectsMenuComponent);
  }

  private setupAnalyticsUserEventListener(): void {
    this._authFacade
      .getUser()
      .pipe(
        distinctUntilChanged((a, b) => a?.Id === b?.Id),
        untilDestroyed(this)
      )
      .subscribe(
        ({
          Id,
          Name,
          Email,
          GivenName,
          FamilyName,
          TenantCode,
          TenantId,
          AsiNumber,
          CompanyId,
          CompanyName,
          IsAdmin,
          IsDistributor,
          IsSupplier,
          IsCorporate,
          IsInternal,
          displayName,
          UserName,
        }) => {
          this._analytics.userEvent$.next({
            userId: Id.toString(),
            traits: {
              Name,
              Email,
              GivenName,
              FamilyName,
              TenantCode,
              TenantId,
              AsiNumber,
              CompanyId,
              CompanyName,
              IsAdmin,
              IsDistributor,
              IsSupplier,
              IsCorporate,
              IsInternal,
              displayName,
              UserName,
            },
          });
        }
      );
  }
}

@NgModule({
  declarations: [AppRootComponent],
  imports: [
    CommonModule,
    A11yModule,
    RouterModule,
    BottomSheetMenuComponentModule,
    CosmosLayoutModule,
    EncoreLayoutModule,
    CosGlobalHeaderModule,
    CosFiltersModule,
    CosProductCardModule,
    CosSupplierModule,
    CosPaginationModule,
    LogoComponentModule,
    MatDatepickerModule,
    MatDateFnsModule,
    MatMenuModule,
    PortalModule,
    GlobalSearchComponentModule,
    FooterComponentModule,
  ],
  exports: [AppRootComponent],
})
export class AppRootComponentModule {}
