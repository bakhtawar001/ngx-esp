import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from '@esp/auth';
import {
  WebsiteDetailPage,
  WebsiteDetailPageModule,
  WebsiteOrdersPage,
  WebsiteOrdersPageModule,
  WebsiteOverviewPage,
  WebsiteOverviewPageModule,
  WebsitePagesPage,
  WebsitePagesPageModule,
  WebsiteProductsPage,
  WebsiteProductsPageModule,
  WebsiteSearchPage,
  WebsiteSearchPageModule,
  WebsiteSettingsPage,
  WebsiteSettingsPageModule,
  WebsiteTemplatePage,
  WebsiteTemplatePageModule,
} from './pages';

const routes: Route[] = [
  {
    path: '',
    component: WebsiteSearchPage,
    data: {
      analytics: {
        page: 'WebsiteDetail',
      },
      meta: { title: 'Detail' },
    },
    canActivate: [AuthGuard],
  },
  {
    path: ':websiteId',
    component: WebsiteDetailPage,
    canActivate: [AuthGuard],
    // resolve: [LoadWebsiteResolver],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: WebsiteOverviewPage,
      },
      {
        path: 'overview',
        pathMatch: 'full',
        component: WebsiteOverviewPage,
      },
      {
        path: 'template',
        component: WebsiteTemplatePage,
      },
      {
        path: 'products',
        component: WebsiteProductsPage,
      },
      {
        path: 'pages',
        component: WebsitePagesPage,
      },
      {
        path: 'orders',
        component: WebsiteOrdersPage,
      },
      {
        path: 'settings',
        component: WebsiteSettingsPage,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    WebsiteSearchPageModule,
    WebsiteDetailPageModule,
    WebsiteOverviewPageModule,
    WebsiteTemplatePageModule,
    WebsiteProductsPageModule,
    WebsitePagesPageModule,
    WebsiteOrdersPageModule,
    WebsiteSettingsPageModule,
  ],
})
export class WebsitesRoutingModule {}
