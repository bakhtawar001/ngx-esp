import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { OrderDomainModel } from '@esp/models';

@Component({
  selector: 'esp-order-quote-information',
  templateUrl: './order-quote-information.component.html',
  styleUrls: ['./order-quote-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderQuoteInformationComponent {
  @Input() order: OrderDomainModel;

  @Input() locked: boolean;

  dateFormat = 'longDate';
}

@NgModule({
  imports: [CommonModule, CosAttributeTagModule],
  declarations: [OrderQuoteInformationComponent],
  exports: [OrderQuoteInformationComponent],
})
export class OrderQuoteInformationComponentModule {}
