import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';

@Component({
  selector: 'esp-order-actions-products',
  templateUrl: './order-actions-products.component.html',
  styleUrls: ['./order-actions-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderActionsProductsComponent {}

@NgModule({
  declarations: [OrderActionsProductsComponent],
  imports: [CosButtonModule],
  exports: [OrderActionsProductsComponent],
})
export class OrderActionsProductsComponentModule {}
