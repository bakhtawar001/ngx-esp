import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {
  PresentationCartPage,
  PresentationDetailPage,
  PresentationDetailPageModule,
  PresentationInvoicePage,
  PresentationInvoicesPage,
  PresentationOrdersPage,
  PresentationProductsPage,
  PresentationProofsEditPage,
  PresentationProofsPage,
  PresentationQuoteRequestPage,
  PresentationQuoteSentPage,
  PresentationQuotesPage,
} from './pages';
import { PresentationActivityPage } from './pages/presentation-activity/presentation-activity.page';
import { PresentationOrdersShippedPage } from './pages/presentation-orders-shipped/presentation-orders-shipped.page';
import { PresentationProductPage } from './pages/presentation-product/presentation-product.page';

const routes: Route[] = [
  {
    path: '',
    component: PresentationDetailPage,
    data: { title: `Presentation Detail` },
    canActivate: [], //PresentationExistsGuard
    children: [
      {
        path: '',
        component: PresentationProductsPage,
        data: { title: `Products` },
      },
      {
        path: 'products',
        component: PresentationProductsPage,
        data: { title: `Products` },
      },
      {
        path: 'product',
        component: PresentationProductPage,
        data: { title: `Product` },
      },
      {
        path: 'activity',
        component: PresentationActivityPage,
        data: { title: `Activity` },
      },
      {
        path: 'cart',
        component: PresentationCartPage,
        data: { title: `Cart` },
      },
      {
        path: 'quotes',
        component: PresentationQuotesPage,
        data: { title: `Quotes` },
      },
      {
        path: 'quotes-request',
        component: PresentationQuoteRequestPage,
        data: { title: `Quotes Change Request` },
      },
      {
        path: 'quote-sent',
        component: PresentationQuoteSentPage,
        data: { title: `Quote Sent` },
      },
      {
        path: 'orders',
        component: PresentationOrdersPage,
        data: { title: `Orders` },
      },
      {
        path: 'orders-shipped',
        component: PresentationOrdersShippedPage,
        data: { title: `Orders Shipped` },
      },
      {
        path: 'proofs',
        component: PresentationProofsPage,
        data: { title: `Proofs` },
      },
      {
        path: 'proofs-edit',
        component: PresentationProofsEditPage,
        data: { title: `Edit Proofs` },
      },
      {
        path: 'invoices',
        component: PresentationInvoicesPage,
        data: { title: `Invoices` },
      },
      {
        path: 'invoice',
        component: PresentationInvoicePage,
        data: { title: `Invoice` },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), PresentationDetailPageModule],
  exports: [RouterModule],
})
export class PresentationsRoutingModule {}
