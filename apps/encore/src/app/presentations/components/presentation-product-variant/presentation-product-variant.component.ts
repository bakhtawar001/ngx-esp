import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  Output,
} from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import {
  CosCheckboxChange,
  CosCheckboxModule,
} from '@cosmos/components/checkbox';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { AttributeValue, PresentationProductAttribute } from '@esp/models';

const DEFAULT_LIMIT = 6;

@Component({
  selector: 'esp-presentation-product-variant',
  templateUrl: './presentation-product-variant.component.html',
  styleUrls: ['./presentation-product-variant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductVariantComponent implements OnChanges {
  @Input() variant: PresentationProductAttribute | null = null;
  @Input() label: string;

  @Output()
  updateAttribute = new EventEmitter<PresentationProductAttribute>();

  showVariant = true;
  limit = DEFAULT_LIMIT;
  showMore = false;
  selectedValues: AttributeValue[] = [];

  get allChecked(): boolean {
    return this.variant.Values.length === this.selectedValues.length;
  }

  get isIndeterminate(): boolean {
    return this.selectedValues.length > 0 && !this.allChecked;
  }

  get isShowMoreEnabled() {
    return this.variant?.Values.length > DEFAULT_LIMIT;
  }

  ngOnChanges(): void {
    this.selectedValues = [];
    this.variant?.Values?.forEach((value) => {
      if (value.IsVisible) {
        this.selectedValues.push(value);
      }
    });
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
    this.limit = this.showMore
      ? this.variant?.Values.length || this.limit
      : DEFAULT_LIMIT;
  }

  toggleVariant() {
    this.showVariant = !this.showVariant;
    if (this.showVariant) {
      this.showMore = false;
      this.limit = DEFAULT_LIMIT;
    }
  }

  isChecked(value: AttributeValue) {
    const index = this.selectedValues.indexOf(value);
    return index > -1;
  }

  toggleSelect(event: CosCheckboxChange, value: AttributeValue) {
    if (event.checked) {
      this.selectedValues.push(value);
    } else {
      const index = this.selectedValues.indexOf(value);
      if (index >= 0) {
        this.selectedValues.splice(index, 1);
      }
    }
    this.emitUpdatedAttribute();
  }

  toggleSelectAll(event: CosCheckboxChange) {
    this.selectedValues.length = 0;
    if (event.checked) {
      this.selectedValues.push(...this.variant.Values);
    }
    this.emitUpdatedAttribute();
  }

  private emitUpdatedAttribute() {
    const attribute: PresentationProductAttribute = {
      ...this.variant,
      Values: this.variant.Values.map((x) => ({
        ...x,
        IsVisible: this.selectedValues.includes(x),
      })),
    };
    this.updateAttribute.emit(attribute);
  }
}

@NgModule({
  declarations: [PresentationProductVariantComponent],
  imports: [
    CommonModule,
    CosButtonModule,
    CosCardModule,
    CosCheckboxModule,
    CosSlideToggleModule,
  ],
  exports: [PresentationProductVariantComponent],
})
export class PresentationProductVariantComponentModule {}
