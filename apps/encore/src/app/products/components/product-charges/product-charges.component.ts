import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  Input,
  NgModule,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { AttributeValue, AttributeValueType } from '@smartlink/models';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-charges',
  templateUrl: './product-charges.component.html',
})
export class ProductChargesComponent implements OnChanges {
  @ContentChild(TemplateRef, { static: false })
  public template: TemplateRef<any>;

  @Input() attributes: AttributeValueType[];

  public values: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.attributes && changes.attributes.currentValue) {
      this.values = groupMethods(changes.attributes.currentValue);
    }
  }
}

function groupMethods(methods: AttributeValueType[]) {
  if (!methods) {
    return [];
  } else if (!Array.isArray(methods)) {
    return methods;
  }

  return methods.map(groupMethod);
}

function groupMethod(method: AttributeValue) {
  const charges = Array.isArray(method.Charges)
    ? method.Charges
    : method.Charges
    ? [method.Charges]
    : undefined;

  return typeof method === 'string'
    ? method
    : {
        ...method,
        singlePrices: charges?.filter((charge) => charge.Prices?.length === 1),
        multiplePrices: charges?.filter((charge) => charge.Prices?.length > 1),
        types: charges?.map((charge) => charge.Type).join(', '),
        values: method.Values?.map((value: any) =>
          typeof value === 'string' ? value : value.Name
        ).join(', '),
        options: method.Options ? groupMethods(method.Options) : null,
      };
}

@NgModule({
  declarations: [ProductChargesComponent],
  imports: [CommonModule],
  exports: [ProductChargesComponent],
})
export class ProductChargesComponentModule {}
