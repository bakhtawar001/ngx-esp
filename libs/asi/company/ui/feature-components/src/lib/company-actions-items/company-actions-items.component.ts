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
import { Company, CompanySearch } from '@esp/models';

@Component({
  selector: 'asi-company-actions-items',
  templateUrl: './company-actions-items.component.html',
  styleUrls: ['./company-actions-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiCompanyActionsItemsComponent {
  @Input() company!: CompanySearch | Company;

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
  declarations: [AsiCompanyActionsItemsComponent],
  imports: [CommonModule, MatMenuModule],
  exports: [AsiCompanyActionsItemsComponent],
})
export class AsiCompanyActionsItemsModule {}
