import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
} from '@angular/core';
import { Product } from '@smartlink/models';
import { flattenDeep, orderBy, uniq } from 'lodash-es';
import { ProductPricingTableComponentModule } from '../product-pricing-table';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-matrix',
  templateUrl: './product-matrix.component.html',
  styleUrls: ['./product-matrix.component.scss'],
})
export class ProductMatrixComponent implements OnInit {
  @Input() product: Product;
  @Output() viewAll = new EventEmitter<void>();

  public productPricing: any;
  public productOptions: { [key: string]: any[] };
  public variant = 0;
  public selectedValues = {};

  get variantOptions() {
    if (this.variant === null) {
      return;
    }

    return this.product.Variants?.[this.variant]?.Values?.map((value) => ({
      name: value.Name,
      value: value.Values.map((val) => val.Name).join(', '),
    }));
  }

  ngOnInit() {
    this.productPricing = this.getProductPricing();
    this.productOptions = this.getProductOptions();

    if (this.productOptions) {
      Object.keys(this.productOptions).forEach((key) => {
        this.selectedValues[key] = this.productOptions[key][0].Name;
      });
    }
  }

  criteriaChange(key: string, $event: any) {
    this.selectedValues[key] =
      typeof $event === 'string' ? $event : $event.target.value;

    this.setVariant();
    this.productPricing = this.getProductPricing();
  }

  setVariant() {
    let variant = this.product.Variants.findIndex((variant) => {
      return (
        variant.Values.filter((val) => {
          return !!val.Values.find(
            (v) => v.Name === this.selectedValues[val.Name]
          );
        }).length === variant.Values.length
      );
    });

    if (variant === -1) {
      variant = null;
    }

    this.variant = variant;
  }

  getProductOptions() {
    if (this.product.Variants) {
      const options = {};

      this.product.Variants.filter((variant) => !!variant.Values).forEach(
        (variant) => {
          variant.Values.forEach((value) => {
            if (options[value.Name]) {
              value.Values.forEach((val) => {
                const index = options[value.Name].findIndex(
                  (option) => option.Name === val.Name
                );

                if (index === -1) {
                  options[value.Name].push(val);

                  options[value.Name] = orderBy(options[value.Name], ['Seq']);
                }
              });
            } else {
              options[value.Name] = [...value.Values];
            }
          });
        }
      );

      return options;
    }
  }

  getProductPricing() {
    if (this.product.Variants && this.variant === null) {
      return;
    }

    const _variants = {
      ...(this.product.Variants?.[this.variant] || {
        PriceIncludes: this.product.PriceIncludes,
        Prices: this.product.Prices,
      }),
    };

    return _variants;
  }

  getOppositeOptionFilter(key: string) {
    const keys = Object.keys(this.selectedValues);

    const index = keys.indexOf(key);

    return this.selectedValues[index === 0 ? keys[1] : keys[0]];
  }

  getAvailabilityForValue(key: string, value: string) {
    const availability = uniq(
      flattenDeep(
        this.product.Variants?.filter(
          (variant) =>
            variant.Values.filter(
              (val) =>
                val.Name !== key &&
                val.Values.filter((v) => v.Name === value).length
            ).length
        ).map((variant) =>
          variant.Values.filter((val) => val.Name === key).map((val) =>
            val.Values.map((v) => v.Name)
          )
        )
      )
    );

    return availability;
  }
}

@NgModule({
  declarations: [ProductMatrixComponent],
  imports: [CommonModule, ProductPricingTableComponentModule],
  exports: [ProductMatrixComponent],
})
export class ProductMatrixComponentModule {}
