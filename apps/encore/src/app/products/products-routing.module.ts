import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from '@esp/auth';
import { CPNGuard, LoadProductResolver } from '@smartlink/products';
import {
  ProductDetailPage,
  ProductDetailPageModule,
  ProductSearchPage,
  ProductSearchPageModule,
  SponsoredArticlePage,
} from './pages';

const routes: Route[] = [
  {
    path: '',
    component: ProductSearchPage,
    data: {
      analytics: {
        page: 'ProductSearch',
      },
      meta: { title: `Product Results` },
    },
    canActivate: [AuthGuard, CPNGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
  {
    path: ':id',
    component: ProductDetailPage,
    data: {
      analytics: {
        page: 'ProductDetail',
      },
      meta: { title: `Product Details` },
    },
    canActivate: [AuthGuard, LoadProductResolver],
    resolve: [LoadProductResolver],
  },
  {
    path: 'article/:id',
    component: SponsoredArticlePage,
    data: {
      meta: { title: `Sponsored Content` },
    },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ProductDetailPageModule,
    ProductSearchPageModule,
  ],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
