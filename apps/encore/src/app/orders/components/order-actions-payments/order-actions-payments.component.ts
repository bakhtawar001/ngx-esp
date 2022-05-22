import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';

@Component({
  selector: 'esp-order-actions-payments',
  templateUrl: './order-actions-payments.component.html',
  styleUrls: ['./order-actions-payments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderActionsPaymentsComponent {}

@NgModule({
  declarations: [OrderActionsPaymentsComponent],
  imports: [CosButtonModule],
  exports: [OrderActionsPaymentsComponent],
})
export class OrderActionsPaymentsComponentModule {}
