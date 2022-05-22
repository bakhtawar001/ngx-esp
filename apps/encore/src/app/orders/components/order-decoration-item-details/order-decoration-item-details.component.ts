import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { CosAccordionModule } from '@cosmos/components/accordion';
import { CosButtonModule } from '@cosmos/components/button';

@Component({
  selector: 'esp-order-decoration-item-details',
  templateUrl: './order-decoration-item-details.component.html',
  styleUrls: ['./order-decoration-item-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OrderDecorationItemDetailsComponent {
  isContentVisible: boolean;

  toggle() {
    this.isContentVisible = !this.isContentVisible;
  }
}

@NgModule({
  declarations: [OrderDecorationItemDetailsComponent],
  imports: [CosAccordionModule, CommonModule, CosButtonModule],
  exports: [OrderDecorationItemDetailsComponent],
})
export class OrderDecorationItemDetailsComponentModule {}
