import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroupComponent } from '@cosmos/forms';
import { OrderDomainModel } from '@esp/models';
import { EditableOrderContactComponentModule } from '../editable-order-contact';
import { OrderCustomerAddressComponentModule } from '../order-customer-address';

@Component({
  selector: 'esp-order-customer-info-edit',
  templateUrl: './order-customer-info-edit.component.html',
  styleUrls: ['./order-customer-info-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCustomerInfoEditComponent
  extends FormGroupComponent<any>
  implements AfterViewInit
{
  @Input() editableOrder: OrderDomainModel;

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.form.patchValue(this.editableOrder);
  }

  override createForm() {
    return this._fb.group<any>({});
  }
}

@NgModule({
  declarations: [OrderCustomerInfoEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OrderCustomerAddressComponentModule,
    EditableOrderContactComponentModule,
  ],
  exports: [OrderCustomerInfoEditComponent],
})
export class OrderCustomerInfoEditComponentModule {}
