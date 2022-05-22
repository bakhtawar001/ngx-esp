import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { Product } from '@smartlink/models';
import {
  Prop65PipeModule,
  FormatArrayListPipeModule,
} from '@smartlink/products';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-safety-warnings',
  templateUrl: './product-safety-warnings.component.html',
  styleUrls: ['./product-safety-warnings.component.scss'],
})
export class ProductSafetyWarningsComponent {
  @Input() product: Product;

  get prop65Warnings() {
    return this.getWarningsByType('PROP');
  }

  get safetyWarnings() {
    return this.getWarningsByType('SWCH');
  }

  get certifications() {
    return this.product?.Certifications?.filter(
      (cert) => cert.Code === 'NOTE' && cert.Name.length
    );
  }

  getWarningsByType(type: string): any {
    return this.product?.Warnings.filter((warning) => warning.Type === type);
  }
}

@NgModule({
  declarations: [ProductSafetyWarningsComponent],
  imports: [CommonModule, FormatArrayListPipeModule, Prop65PipeModule],
  exports: [ProductSafetyWarningsComponent],
})
export class ProductSafetyWarningsComponentModule {}
