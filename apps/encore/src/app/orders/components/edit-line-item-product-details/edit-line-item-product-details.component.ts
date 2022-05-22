import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { ProductLineItemDomainModel } from '@esp/models';

@Component({
  selector: 'esp-edit-line-item-product-details',
  templateUrl: './edit-line-item-product-details.component.html',
  styleUrls: ['./edit-line-item-product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLineItemProductDetailsComponent {
  @Input() lineItem: ProductLineItemDomainModel;

  form = this.createForm();

  private createForm() {
    return new FormGroup({
      Name: new FormControl(''),
      Number: new FormControl(''),
      Category: new FormControl(''),
      CPN: new FormControl(''),
      Summary: new FormControl(''),
      Note: new FormControl(''),
    });
  }
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CosFormFieldModule,
    CosInputModule,
  ],
  declarations: [EditLineItemProductDetailsComponent],
  exports: [EditLineItemProductDetailsComponent],
})
export class EditLineItemProductDetailsComponentModule {}
