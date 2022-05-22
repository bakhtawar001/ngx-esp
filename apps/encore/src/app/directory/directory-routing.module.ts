import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from '@esp/auth';
import { CompanyActionsBarComponent } from '../companies/components/company-actions-bar/company-actions-bar.component';
import { CompanySearchPage } from '../companies/pages/company-search/company-search.page';
import { ContactsActionsBarComponent } from '../contacts/components/contacts-actions-bar/contacts-actions-bar.component';
import { ContactSearchPage } from '../contacts/pages/contact-search/contact-search.page';
import { DirectorySearchPage, DirectorySearchPageModule } from './pages';

const routes: Route[] = [
  {
    path: '',
    component: DirectorySearchPage,
    data: { title: `Directory` },
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'companies',
      },
      {
        path: 'companies',
        data: {
          searchType: {
            value: null,
            title: 'All Companies',
            type: 'Company',
          },
          meta: { title: 'Companies' },
        },
        children: [
          {
            path: '',
            component: CompanySearchPage,
          },
          {
            path: '',
            component: CompanyActionsBarComponent,
            outlet: 'actions',
          },
        ],
      },
      {
        path: 'customers',
        data: {
          searchType: {
            value: 'customer',
            title: 'Customers',
            type: 'Customer',
          },
          meta: { title: 'Customers' },
        },
        children: [
          {
            path: '',
            component: CompanySearchPage,
          },
          {
            path: '',
            component: CompanyActionsBarComponent,
            outlet: 'actions',
          },
        ],
      },
      {
        path: 'suppliers',
        data: {
          searchType: {
            value: 'supplier',
            title: 'Suppliers',
            type: 'Supplier',
          },
          meta: { title: 'Suppliers' },
        },
        children: [
          {
            path: '',
            component: CompanySearchPage,
          },
          {
            path: '',
            component: CompanyActionsBarComponent,
            outlet: 'actions',
          },
        ],
      },
      {
        path: 'decorators',
        data: {
          searchType: {
            value: 'decorator',
            title: 'Decorators',
            type: 'Decorator',
          },
          meta: { title: 'Decorators' },
        },
        children: [
          {
            path: '',
            component: CompanySearchPage,
          },
          {
            path: '',
            component: CompanyActionsBarComponent,
            outlet: 'actions',
          },
        ],
      },
      {
        path: 'contacts',
        data: { meta: { title: `Contacts` } },
        children: [
          {
            path: '',
            component: ContactSearchPage,
          },
          {
            path: '',
            component: ContactsActionsBarComponent,
            outlet: 'actions',
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), DirectorySearchPageModule],
})
export class DirectoryRoutingModule {}
