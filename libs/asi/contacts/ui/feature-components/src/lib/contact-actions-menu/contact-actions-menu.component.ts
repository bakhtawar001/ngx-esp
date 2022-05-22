import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { ContactCrudService } from '@asi/contacts/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { ContactsActions } from '@esp/contacts';
import { Contact } from '@esp/models';
import { ContactActionsMenuLocalState } from './contact-actions-menu.local-state';
import { ContactActionsItemsModule } from '../contact-actions-items/contact-actions-items.component';

@Component({
  selector: 'asi-contact-actions-menu',
  templateUrl: './contact-actions-menu.component.html',
  styleUrls: ['./contact-actions-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    ContactActionsMenuLocalState,
    ContactCrudService.withProviders({
      delete: ContactsActions.Delete,
      transferOwnership: ContactsActions.TransferOwnership,
    }),
  ],
})
export class AsiContactActionsMenuComponent {
  @Input()
  contact!: Contact;

  constructor(private readonly state: ContactActionsMenuLocalState) {}

  async onDeleteContact(): Promise<void> {
    await this.state.deleteContact(this.contact);
  }

  onToggleStatus(): void {
    this.contact.IsActive
      ? this.state.makeInactive(this.contact)
      : this.state.makeActive(this.contact);
  }

  async onTransferOwnership(): Promise<void> {
    await this.state.transferOwnership(this.contact);
  }
}

@NgModule({
  declarations: [AsiContactActionsMenuComponent],
  imports: [
    CommonModule,
    CosButtonModule,
    MatMenuModule,
    ContactActionsItemsModule,
  ],
  exports: [AsiContactActionsMenuComponent],
})
export class AsiContactActionsMenuModule {}
