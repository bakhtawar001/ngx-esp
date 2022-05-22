import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  NgModule,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumberStringPipeModule } from '@cosmos/common';
import { InventoryQuantity } from '@smartlink/models';
import { FormatArrayListPipeModule } from '@smartlink/products';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-inventory',
  templateUrl: './product-inventory.component.html',
  styleUrls: ['./product-inventory.component.scss'],
})
export class ProductInventoryComponent implements OnChanges {
  @Input() inventory: InventoryQuantity[];

  public selectedInventory: InventoryQuantity;

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.inventory && changes.inventory.currentValue) {
      this.selectedInventory = this.inventory[0];
    }
  }

  setSelected(item: InventoryQuantity) {
    this.selectedInventory = item;
  }
}

@NgModule({
  declarations: [ProductInventoryComponent],
  imports: [
    CommonModule,
    FormsModule,

    FormatArrayListPipeModule,
    NumberStringPipeModule,
  ],
  exports: [ProductInventoryComponent],
})
export class ProductInventoryComponentModule {}
