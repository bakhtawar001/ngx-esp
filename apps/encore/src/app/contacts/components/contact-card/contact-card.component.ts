import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosCardModule } from '@cosmos/components/card';
import { CosPillModule } from '@cosmos/components/pill';
import { ContactSearch } from '@esp/models';
import { AddressDisplayComponentModule } from '../../../directory/components/address-display';
import { PartyAvatarComponentModule } from '../../../directory/components/party-avatar';
import { RecordOwnerComponentModule } from '../../../directory/components/record-owner/record-owner.component';
import { AsiContactActionsItemsModule } from '@asi/contacts/ui/feature-components';

@Component({
  selector: 'esp-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactCardComponent {
  @Input() contact!: ContactSearch;
  @Input() icon = 'fa fa-building';

  @Output() delete = new EventEmitter<void>();
  @Output() toggleStatus = new EventEmitter<void>();
  @Output() transferOwner = new EventEmitter<void>();

  onDelete(): void {
    this.delete.emit();
  }

  onToggleStatus(): void {
    this.toggleStatus.emit();
  }

  onTransferOwner(): void {
    this.transferOwner.emit();
  }
}

@NgModule({
  declarations: [ContactCardComponent],
  imports: [
    CommonModule,

    MatMenuModule,

    CosAttributeTagModule,
    CosCardModule,
    CosPillModule,

    AddressDisplayComponentModule,
    PartyAvatarComponentModule,
    RecordOwnerComponentModule,
    AsiContactActionsItemsModule,
  ],
  exports: [ContactCardComponent],
})
export class ContactCardComponentModule {}
