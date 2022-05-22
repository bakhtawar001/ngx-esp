import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';

@Component({
  selector: 'esp-order-decoration-item-product',
  templateUrl: './order-decoration-item-product.component.html',
  styleUrls: ['./order-decoration-item-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDecorationItemProductComponent {}

@NgModule({
  declarations: [OrderDecorationItemProductComponent],
  imports: [CosButtonModule],
  exports: [OrderDecorationItemProductComponent],
})
export class OrderDecorationItemProductComponentModule {}
