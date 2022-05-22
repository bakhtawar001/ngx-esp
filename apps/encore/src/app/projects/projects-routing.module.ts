import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FeatureFlagsGuard,
  FeatureFlagsRouteData,
} from '@cosmos/feature-flags';
import { TypedRoute } from '@cosmos/router';
import { AuthGuard } from '@esp/auth';
import { LoadProjectResolver } from '@esp/projects';
// import { ProjectExistsGuards } from '@smartlink/projects';
import {
  ProjectCommunicationsPage,
  ProjectCommunicationsPageModule,
  ProjectDetailPage,
  ProjectDetailPageModule,
  ProjectNotesPage,
  ProjectNotesPageModule,
  ProjectOrdersPageModule,
  ProjectOverviewPage,
  ProjectOverviewPageModule,
  ProjectProofsPage,
  ProjectProofsPageModule,
  ProjectSearchPage,
  ProjectSearchPageModule,
} from './pages';
import { ProjectProductDetailPage } from './pages/project-product-detail';

const routes: TypedRoute<FeatureFlagsRouteData>[] = [
  {
    path: '',
    component: ProjectSearchPage,
    data: { title: `Project Results` },
    canActivate: [AuthGuard],
  },
  {
    path: 'product-detail',
    component: ProjectProductDetailPage,
  },
  {
    path: ':id',
    component: ProjectDetailPage,
    data: { title: `Project Detail` },
    canActivate: [AuthGuard, LoadProjectResolver],
    resolve: [LoadProjectResolver],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ProjectOverviewPage,
      },
      {
        path: 'activity-notes',
        pathMatch: 'full',
        component: ProjectOverviewPage,
      },
      {
        path: 'presentations',
        loadChildren: async () =>
          (await import('../presentations/presentations.module'))
            .PresentationsModule,
        data: { preload: true },
      },
      {
        path: 'orders',
        loadChildren: async () =>
          (await import('../orders/orders.module')).OrdersModule,
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
        path: 'proofs',
        component: ProjectProofsPage,
      },
      {
        path: 'communications',
        component: ProjectCommunicationsPage,
      },
      {
        path: 'notes',
        component: ProjectNotesPage,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ProjectDetailPageModule,
    ProjectSearchPageModule,
    ProjectOverviewPageModule,
    ProjectOrdersPageModule,
    ProjectProofsPageModule,
    ProjectCommunicationsPageModule,
    ProjectNotesPageModule,
  ],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
