import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from '@esp/auth';
import { ShouldCreatePresentationGuard } from './guards';
import {
  PresentationDetailPage,
  PresentationDetailPageModule,
  PresentationSearchPage,
  PresentationSearchPageModule,
  PresentationSettingsPage,
  PresentationSettingsPageModule,
} from './pages';
import { PresentationProductPage } from './pages/presentation-product';
import {
  LoadPresentationResolver,
  LoadPresentationProductResolver,
} from './resolvers';

const routes: Route[] = [
  {
    path: 'search',
    component: PresentationSearchPage,
    data: {
      analytics: {
        page: 'PresentationSearchPage',
      },
      meta: { title: 'Search' },
    },
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: PresentationDetailPage,
    data: {
      analytics: {
        page: 'PresentationDetail',
      },
      meta: { title: 'Detail' },
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            /* webpackChunkName: 'create-presentation' */ './pages/create-presentation'
          ).then((m) => m.CreatePresentationPageModule),
        canActivate: [ShouldCreatePresentationGuard],
      },
      {
        path: ':presentationId',
        component: PresentationSettingsPage,
        resolve: [LoadPresentationResolver],
      },
      {
        path: ':presentationId/product/:productId',
        canActivate: [LoadPresentationProductResolver],
        resolve: [LoadPresentationProductResolver],
        component: PresentationProductPage,
        // loadChildren: async () =>
        //   (
        //     await import(
        //       /* webpackChunkName: 'presentation-product' */ './pages/presentation-product'
        //     )
        //   ).PresentationProductPageModule,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    PresentationSearchPageModule,
    PresentationDetailPageModule,
    PresentationSettingsPageModule,
  ],
})
export class PresentationsRoutingModule {}
