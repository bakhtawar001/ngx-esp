import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'esp-presentation-product-price-range',
  templateUrl: './presentation-product-price-range.component.html',
  styleUrls: ['./presentation-product-price-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductPriceRangeComponent {}

@NgModule({
  declarations: [PresentationProductPriceRangeComponent],
  imports: [CommonModule],
  exports: [PresentationProductPriceRangeComponent],
})
export class PresentationProductPriceRangeComponentModule {}
