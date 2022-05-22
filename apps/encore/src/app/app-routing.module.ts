import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule } from '@angular/router';
import {
  FeatureFlagsGuard,
  FeatureFlagsRouteData,
} from '@cosmos/feature-flags';
import { NetworkAwarePreloadStrategy, TypedRoute } from '@cosmos/router';
import { AuthGuard } from '@esp/auth';
import { HasPermissionGuard } from '@smartlink/auth';
import { LoginPageGuard, RedirectGuard } from './auth/guards';

const ROUTER_OPTIONS: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  preloadingStrategy: NetworkAwarePreloadStrategy,
  onSameUrlNavigation: 'reload',
};

const routes: TypedRoute<FeatureFlagsRouteData>[] = [
  {
    path: '',
    pathMatch: 'full',
    children: [],
    data: {
      defaultPath: 'home',
    },
    canActivate: [RedirectGuard],
  },
  {
    path: 'home',
    loadChildren: async () =>
      (await import(/* webpackChunkName: 'home' */ './home/home.module'))
        .HomeModule,
    data: { preload: 'always', hideGlobalSearch: true },
    canActivate: [AuthGuard, HasPermissionGuard],
  },
  {
    path: 'products',
    loadChildren: async () =>
      (await import('./products/products.module')).ProductsModule,
    data: { preload: 'always' },
    canActivate: [AuthGuard, HasPermissionGuard],
  },
  {
    path: 'suppliers',
    loadChildren: async () =>
      (await import('./suppliers/suppliers.module')).SuppliersModule,
    canActivate: [AuthGuard, HasPermissionGuard],
  },
  {
    path: 'collections',
    loadChildren: async () =>
      (await import('./collections/collections.module')).CollectionsModule,
    data: {
      meta: {
        title: 'Collections',
      },
    },
    canActivate: [AuthGuard, HasPermissionGuard],
  },
  {
    path: 'orders',
    loadChildren: async () =>
      (await import('./orders/orders.module')).OrdersModule,
    data: {
      preload: true,
      featureFlags: {
        matches: ['orders'],
      },
    },
    canActivate: [AuthGuard],
    canLoad: [FeatureFlagsGuard],
  },
  {
    path: 'presentations',
    loadChildren: async () =>
      (await import('./presentations/presentations.module'))
        .PresentationsModule,
    canActivate: [AuthGuard, HasPermissionGuard],
  },
  {
    path: 'projects',
    loadChildren: async () =>
      (await import('./projects/projects.module')).ProjectsModule,
    data: {
      preload: true,
      featureFlags: {
        matches: ['projects'],
      },
    },
    canActivate: [AuthGuard],
    canLoad: [FeatureFlagsGuard],
  },
  {
    path: 'settings',
    loadChildren: async () =>
      (await import('./settings/settings.module')).SettingsModule,
    data: { preload: true },
    canActivate: [AuthGuard, HasPermissionGuard],
  },
  {
    loadChildren: async () =>
      (
        await import(
          /* webpackChunkName: 'license-agreement' */ './auth/pages/license-agreement'
        )
      ).LicenseAgreementPageModule,
    path: 'license-agreement',
    data: { preload: 'always' },
    canActivate: [AuthGuard, LoginPageGuard],
  },
  {
    path: 'directory',
    loadChildren: async () =>
      (await import('./directory/directory.module')).DirectoryModule,
    data: { preload: true },
    canActivate: [AuthGuard],
  },
  {
    path: 'companies',
    loadChildren: async () =>
      (await import('./companies/companies.module')).CompaniesModule,
    data: { preload: true },
    canActivate: [AuthGuard],
  },
  {
    path: 'contacts',
    loadChildren: async () =>
      (await import('./contacts/contacts.module')).ContactsModule,
    data: { preload: true },
    canActivate: [AuthGuard],
  },
  {
    loadChildren: async () =>
      (await import(/* webpackChunkName: 'unauthorized' */ '@asi/auth'))
        .AsiInsufficientPermissionsPage,
    path: 'unauthorized',
  },
  {
    path: 'websites',
    loadChildren: async () =>
      (await import('./websites/websites.module')).WebsitesModule,
    data: { preload: true },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, ROUTER_OPTIONS)],
})
export class AppRoutingModule {}
