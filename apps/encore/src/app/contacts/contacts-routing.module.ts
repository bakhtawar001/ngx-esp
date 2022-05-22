import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@esp/auth';
import { CONTACT_DETAIL_MODULES } from './components';
import { ContactDetailComponent } from './components/contact-detail';
import { ContactNotesComponent } from './components/contact-notes';
import { ContactDetailPage, ContactDetailPageModule } from './pages';

export const routes: Routes = [
  {
    path: ':id',
    component: ContactDetailPage,
    data: {
      meta: { title: 'Contact Details' },
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'details',
      },
      {
        path: 'details',
        component: ContactDetailComponent,
      },
      {
        path: 'notes',
        component: ContactNotesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ContactDetailPageModule,
    ...CONTACT_DETAIL_MODULES,
  ],
  exports: [RouterModule],
})
export class ContactsRoutingModule {}
