import { NgModule } from '@angular/core';
import { EspContactsModule } from '@esp/contacts';
import { ContactsRoutingModule } from './contacts-routing.module';

@NgModule({
  imports: [ContactsRoutingModule, EspContactsModule],
})
export class ContactsModule {}
