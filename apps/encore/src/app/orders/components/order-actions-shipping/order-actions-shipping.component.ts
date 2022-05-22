import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';

@Component({
  selector: 'esp-order-actions-shipping',
  templateUrl: './order-actions-shipping.component.html',
  styleUrls: ['./order-actions-shipping.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderActionsShippingComponent {}

@NgModule({
  declarations: [OrderActionsShippingComponent],
  imports: [CosButtonModule],
  exports: [OrderActionsShippingComponent],
})
export class OrderActionsShippingComponentModule {}
