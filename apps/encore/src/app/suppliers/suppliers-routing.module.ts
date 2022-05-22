import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from '@esp/auth';
import { LoadSupplierResolver } from '@smartlink/suppliers';
import { SupplierDetailPage, SupplierDetailPageModule } from './pages';
import {
  SupplierSearchPage,
  SupplierSearchPageModule,
} from './pages/supplier-search/supplier-search.page';

const routes: Route[] = [
  {
    path: '',
    component: SupplierSearchPage,
    data: {
      analytics: {
        page: 'SupplierSearch',
      },
      meta: { title: `Supplier Results` },
    },
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
  {
    path: ':id',
    component: SupplierDetailPage,
    data: {
      analytics: {
        page: 'SupplierDetail',
      },
      meta: { title: `Supplier Detail` },
    },
    canActivate: [AuthGuard, LoadSupplierResolver],
    resolve: [LoadSupplierResolver],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SupplierDetailPageModule,
    SupplierSearchPageModule,
  ],
  exports: [RouterModule],
})
export class SuppliersRoutingModule {}
