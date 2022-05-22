import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { OrderDomainModel } from '@esp/models';

@Component({
  selector: 'esp-order-side-menu',
  templateUrl: './order-side-menu.component.html',
  styleUrls: ['./order-side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSideMenuComponent {
  @Input() order: OrderDomainModel;
}

@NgModule({
  declarations: [OrderSideMenuComponent],
  imports: [CommonModule],
  exports: [OrderSideMenuComponent],
})
export class OrderSideMenuComponentModule {}
