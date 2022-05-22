import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'esp-edit-line-item-charges',
  templateUrl: './edit-line-item-charges.component.html',
  styleUrls: ['./edit-line-item-charges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLineItemChargesComponent {}

@NgModule({
  declarations: [EditLineItemChargesComponent],
  imports: [CommonModule],
  exports: [EditLineItemChargesComponent],
})
export class EditLineItemChargesComponentModule {}
