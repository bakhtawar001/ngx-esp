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

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-options',
  templateUrl: './product-options.component.html',
})
export class ProductOptionsComponent implements OnChanges {
  @ContentChild(TemplateRef, { static: false })
  public template: TemplateRef<any>;

  @Input()
  options: any[];

  _options: any[];

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.options && changes.options.currentValue) {
      this._options = this.groupOptions(changes.options.currentValue);
    }
  }

  private groupOptions(options) {
    if (!options) {
      return [];
    }

    const groups = options.map((option) => {
      const nonGroupOption = !option.Groups || !option.Groups.length;
      const isStringValues =
        option?.Values?.length && this.isString(option.Values);
      const formattedStringValues = isStringValues
        ? this.getFormattedStringValues(option.Values)
        : '';

      return nonGroupOption
        ? {
            ...option,
            nonGroupOption,
            isStringValues,
            formattedStringValues,
          }
        : {
            ...option,
            nonGroupOption,
            values: option.Values
              ? option.Values.map((value) =>
                  this.isString(value) ? value : value.Name
                ).join(', ')
              : option.Groups.map((group) => group.Name).join(', '),
            isStringValues,
            formattedStringValues,
          };
    });

    return groups;
  }

  isString(val: any): boolean {
    if (Array.isArray(val)) {
      return typeof val[0] === 'string';
    }

    return typeof val === 'string';
  }

  private getFormattedStringValues(values: string[]) {
    if (values?.length) {
      return values.map((value) => value).join(', ');
    }

    return '';
  }
}

@NgModule({
  declarations: [ProductOptionsComponent],
  imports: [CommonModule],
  exports: [ProductOptionsComponent],
})
export class ProductOptionsComponentModule {}
