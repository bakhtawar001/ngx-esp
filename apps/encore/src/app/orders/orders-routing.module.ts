import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from '@esp/auth';
import { OrderActionsDecorationComponent } from './components/order-actions-decoration';
import { OrderActionsPaymentsComponent } from './components/order-actions-payments';
import { OrderActionsProductsComponent } from './components/order-actions-products';
import { OrderActionsShippingComponent } from './components/order-actions-shipping';
import { CurrentOrderGuard } from './guards';
import {
  OrderDecorationPage,
  OrderDecorationPageModule,
  OrderDetailPage,
  OrderDetailPageModule,
  OrderEditLineItemPage,
  OrderEditLineItemPageModule,
  OrderPaymentsPage,
  OrderPaymentsPageModule,
  OrderPoPage,
  OrderPoPageModule,
  OrderProductsPage,
  OrderProductsPageModule,
  OrderSearchPage,
  OrderSearchPageModule,
  OrderShippingPage,
  OrderShippingPageModule,
} from './pages';
import {
  LoadLineItemResolver,
  LoadOrderResolver,
  LoadOrdersResolver,
} from './resolvers';

const routes: Route[] = [
  {
    path: '',
    component: OrderSearchPage,
    data: { title: `Orders` },
    canActivate: [AuthGuard, CurrentOrderGuard],
  },
  {
    path: ':orderId',
    component: OrderDetailPage,
    data: { title: `Order Detail` },
    canActivate: [AuthGuard, LoadOrdersResolver, LoadOrderResolver],
    resolve: [LoadOrdersResolver, LoadOrderResolver],
    children: [
      {
        path: '',
        redirectTo: 'products',
      },
      {
        path: 'products',
        component: OrderProductsPage,
        pathMatch: 'full',
        data: {
          actions: () => OrderActionsProductsComponent,
        },
      },
      {
        path: 'decoration',
        component: OrderDecorationPage,
        data: {
          actions: () => OrderActionsDecorationComponent,
        },
      },
      {
        path: 'shipping',
        component: OrderShippingPage,
        data: {
          actions: () => OrderActionsShippingComponent,
        },
      },
      {
        path: 'po',
        component: OrderPoPage,
      },
      {
        path: 'payments',
        component: OrderPaymentsPage,
        data: {
          actions: () => OrderActionsPaymentsComponent,
        },
      },
    ],
  },
  {
    path: ':orderId/products/:lineItemId/edit',
    component: OrderEditLineItemPage,
    data: { title: `Order Detail` },
    canActivate: [AuthGuard, LoadLineItemResolver],
    resolve: [LoadLineItemResolver],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    OrderDetailPageModule,
    OrderEditLineItemPageModule,
    OrderSearchPageModule,
    OrderProductsPageModule,
    OrderDecorationPageModule,
    OrderShippingPageModule,
    OrderPoPageModule,
    OrderPaymentsPageModule,
  ],
})
export class OrdersRoutingModule {}
