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
import { Contact, ContactSearch } from '@esp/models';

@Component({
  selector: 'asi-contact-actions-items',
  templateUrl: './contact-actions-items.component.html',
  styleUrls: ['./contact-actions-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactActionsItemsComponent {
  @Input()
  contact!: Contact | ContactSearch;

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
  declarations: [ContactActionsItemsComponent],
  imports: [CommonModule, MatMenuModule],
  exports: [ContactActionsItemsComponent],
})
export class ContactActionsItemsModule {}
