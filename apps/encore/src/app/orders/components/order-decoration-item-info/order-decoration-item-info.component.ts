import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'esp-order-decoration-item-info',
  templateUrl: './order-decoration-item-info.component.html',
  styleUrls: ['./order-decoration-item-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDecorationItemInfoComponent {}

@NgModule({
  declarations: [OrderDecorationItemInfoComponent],
  exports: [OrderDecorationItemInfoComponent],
})
export class OrderDecorationItemInfoComponentModule {}
