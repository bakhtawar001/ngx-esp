import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { OrderDomainModel } from '@esp/models';

@Component({
  selector: 'esp-order-quote-information-edit',
  templateUrl: './order-quote-information-edit.component.html',
  styleUrls: ['./order-quote-information-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderQuoteInformationEditComponent {
  @Input() editableOrder: OrderDomainModel;

  dateFormat = 'longDate';
}

@NgModule({
  declarations: [OrderQuoteInformationEditComponent],
  imports: [CommonModule],
  exports: [OrderQuoteInformationEditComponent],
})
export class OrderQuoteInformationEditComponentModule {}
