import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from '@esp/auth';
import {
  AccountingIntegrationsPage,
  AccountingIntegrationsPageModule,
  CompanyPage,
  CompanyPageModule,
  MarketingPage,
  MarketingPageModule,
  NotificationsPage,
  NotificationsPageModule,
  OrdersPage,
  OrdersPageModule,
  PartnerCredentialsPage,
  PartnerCredentialsPageModule,
  PrivacyPage,
  PrivacyPageModule,
  ProfilePage,
  ProfilePageModule,
  SalesTaxPage,
  SalesTaxPageModule,
  SettingsPage,
  SettingsPageModule,
  SocialIntegrationsPage,
  SocialIntegrationsPageModule,
  SubscriptionPage,
  SubscriptionPageModule,
  TeamsPage,
  TeamsPageModule,
  TemplatesPage,
  TemplatesPageModule,
  TrackingPage,
  TrackingPageModule,
  UsersPage,
  UsersPageModule,
  WhitelabelPage,
  WhitelabelPageModule,
} from './pages';

const routes: Route[] = [
  {
    path: '',
    component: SettingsPage,
    data: {
      meta: { title: `Settings` },
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile',
      },
      {
        path: 'profile',
        component: ProfilePage,
        data: {
          meta: { title: `Profile and login settings` },
        },
      },
      {
        path: 'notifications',
        component: NotificationsPage,
        data: { title: `Notification settings` },
      },
      {
        path: 'marketing',
        component: MarketingPage,
        data: { title: `Marketing and promotions` },
      },
      {
        path: 'company',
        component: CompanyPage,
        data: {
          meta: { title: `Company information` },
        },
      },
      {
        path: 'subscription',
        component: SubscriptionPage,
        data: { title: `Subscription and billing` },
      },
      {
        path: 'users',
        component: UsersPage,
        data: { title: `Manage users` },
      },
      {
        path: 'teams',
        component: TeamsPage,
        data: { title: `Manage teams` },
      },
      {
        path: 'whitelabel',
        component: WhitelabelPage,
        data: { title: `White label settings` },
      },
      {
        path: 'integrations/accounting',
        component: AccountingIntegrationsPage,
        data: { title: `Accounting integrations` },
      },
      {
        path: 'integrations/social',
        component: SocialIntegrationsPage,
        data: { title: `Social media integrations` },
      },
      {
        path: 'integrations/partners',
        component: PartnerCredentialsPage,
        data: { title: `Partner credentials` },
      },
      {
        path: 'privacy',
        component: PrivacyPage,
        data: { title: `Activity privacy` },
      },
      {
        path: 'tracking',
        component: TrackingPage,
        data: { title: `Order and Presentation tracking` },
      },
      {
        path: 'orders',
        component: OrdersPage,
        data: { title: `Orcer creation defaults` },
      },
      {
        path: 'sales-tax',
        component: SalesTaxPage,
        data: { title: `Sales tax` },
      },
      {
        path: 'templates',
        component: TemplatesPage,
        data: { title: `Email and message templates` },
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    AccountingIntegrationsPageModule,
    CompanyPageModule,
    MarketingPageModule,
    MarketingPageModule,
    NotificationsPageModule,
    OrdersPageModule,
    PartnerCredentialsPageModule,
    PrivacyPageModule,
    ProfilePageModule,
    SalesTaxPageModule,
    SettingsPageModule,
    SocialIntegrationsPageModule,
    SubscriptionPageModule,
    TeamsPageModule,
    TemplatesPageModule,
    TrackingPageModule,
    UsersPageModule,
    WhitelabelPageModule,
  ],
})
export class SettingsRoutingModule {}
