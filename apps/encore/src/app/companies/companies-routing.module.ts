import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@esp/auth';
import { COMPANY_DETAIL_MODULES } from './components';
import { CompanyActivityComponent } from './components/company-activity';
import { CompanyArtworkComponent } from './components/company-artwork';
import { CompanyContactsComponent } from './components/company-contacts';
import { CompanyDecorationsComponent } from './components/company-decorations';
import { CompanyDetailComponent } from './components/company-detail';
import { CompanyNotesComponent } from './components/company-notes';
import { CompanyProductHistoryComponent } from './components/company-product-history';
import {
  CompanyDetailPage,
  CompanyDetailPageModule,
  CompanyDetailResolver,
} from './pages';

export const routes: Routes = [
  {
    path: ':id',
    component: CompanyDetailPage,
    data: {
      meta: { title: 'Company Details' },
    },
    resolve: [CompanyDetailResolver],
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'details',
      },
      {
        path: 'activity',
        component: CompanyActivityComponent,
      },
      {
        path: 'details',
        component: CompanyDetailComponent,
      },
      {
        path: 'projects',
        loadChildren: async () =>
          (await import('./pages/company-projects/company-projects.page'))
            .CompanyProjectsPageModule,
        canLoad: [AuthGuard],
      },
      {
        path: 'product-history',
        component: CompanyProductHistoryComponent,
      },
      {
        path: 'notes',
        component: CompanyNotesComponent,
      },
      {
        path: 'artwork',
        component: CompanyArtworkComponent,
      },
      {
        path: 'decorations',
        component: CompanyDecorationsComponent,
      },
      {
        path: 'contacts',
        component: CompanyContactsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CompanyDetailPageModule,
    ...COMPANY_DETAIL_MODULES,
  ],
  exports: [RouterModule],
  providers: [CompanyDetailResolver],
})
export class CompaniesRoutingModule {}
