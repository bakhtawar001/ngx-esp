import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { ContactCrudService } from '@asi/contacts/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { ContactsSearchActions } from '@esp/contacts';
import { ContactSearchLocalState } from '../../local-states';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-contacts-actions-bar',
  templateUrl: './contacts-actions-bar.component.html',
  styleUrls: ['./contacts-actions-bar.component.scss'],
  providers: [
    ContactSearchLocalState,
    ContactCrudService.withProviders({
      create: ContactsSearchActions.Create,
    }),
  ],
})
export class ContactsActionsBarComponent {
  constructor(public readonly state: ContactSearchLocalState) {}

  async createContact(): Promise<void> {
    await this.state.createContact();
  }
}

@NgModule({
  declarations: [ContactsActionsBarComponent],
  imports: [CommonModule, MatMenuModule, CosButtonModule],
})
export class ContactsActionsBarComponentModule {}
