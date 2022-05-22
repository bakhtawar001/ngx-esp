import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from '@esp/auth';
import { LoadCollectionResolver } from '@esp/collections';
import {
  CollectionDetailPage,
  CollectionDetailPageModule,
  CollectionSearchPage,
  CollectionSearchPageModule,
} from './pages';

export const routes: Route[] = [
  {
    path: '',
    component: CollectionSearchPage,
    data: {
      analytics: {
        page: 'CollectionSearch',
      },
      meta: { title: `Collections` },
    },
    canActivate: [AuthGuard],
  },
  {
    path: ':id',
    component: CollectionDetailPage,
    data: {
      analytics: {
        page: 'CollectionDetail',
      },
      meta: { title: `Collection Detail` },
    },
    canActivate: [AuthGuard, LoadCollectionResolver],
    resolve: [LoadCollectionResolver],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CollectionDetailPageModule,
    CollectionSearchPageModule,
  ],
})
export class CollectionsRoutingModule {}
