import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'esp-presentation-product-pricing',
  templateUrl: './presentation-product-pricing.component.html',
  styleUrls: ['./presentation-product-pricing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductPricingComponent {}

@NgModule({
  declarations: [PresentationProductPricingComponent],
  imports: [CommonModule],
  exports: [PresentationProductPricingComponent],
})
export class PresentationProductPricingComponentModule {}
