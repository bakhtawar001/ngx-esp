import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosTableModule } from '@cosmos/components/table';

@Component({
  selector: 'esp-presentation-product-charges-table',
  templateUrl: './presentation-product-charges-table.component.html',
  styleUrls: ['./presentation-product-charges-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductChargesTableComponent {
  @Input() dataSource;

  displayedColumns2 = ['charge', 'quantity', 'price', 'action'];
}

@NgModule({
  declarations: [PresentationProductChargesTableComponent],
  imports: [CommonModule, CosButtonModule, CosTableModule],
  exports: [PresentationProductChargesTableComponent],
})
export class PresentationProductChargesTableComponentModule {}
