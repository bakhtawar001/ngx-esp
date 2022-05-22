import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ContactsSearchState, ContactsState } from './states';

@NgModule({
  imports: [NgxsModule.forFeature([ContactsState, ContactsSearchState])],
})
export class EspContactsModule {}
