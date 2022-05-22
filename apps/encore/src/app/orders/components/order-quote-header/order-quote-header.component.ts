import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CosCardModule } from '@cosmos/components/card';
import { OrderDomainModel } from '@esp/models';
import { cloneDeep } from 'lodash-es';
import { OrderCustomerInfoComponentModule } from '../order-customer-info';
import { OrderCustomerInfoEditComponentModule } from '../order-customer-info-edit';
import { OrderQuoteInformationComponentModule } from '../order-quote-information';
import { OrderQuoteInformationEditComponentModule } from '../order-quote-information-edit';

@Component({
  selector: 'esp-order-quote-header',
  templateUrl: './order-quote-header.component.html',
  styleUrls: ['./order-quote-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderQuoteHeaderComponent {
  @Input() order: OrderDomainModel;

  @Input() locked: boolean;

  @ViewChild('currentForm') form: NgForm;

  isEditing = false;
  editableOrder: OrderDomainModel = null;

  onEdit() {
    this.isEditing = true;
    this.editableOrder = cloneDeep(this.order);
  }

  onSubmit() {
    this.isEditing = false;
  }

  onCancel() {
    this.isEditing = false;
  }
}

@NgModule({
  declarations: [OrderQuoteHeaderComponent],
  imports: [
    CommonModule,
    CosCardModule,
    FormsModule,
    OrderCustomerInfoComponentModule,
    OrderQuoteInformationComponentModule,
    OrderCustomerInfoEditComponentModule,
    OrderQuoteInformationEditComponentModule,
  ],
  exports: [OrderQuoteHeaderComponent],
})
export class OrderQuoteHeaderComponentModule {}
