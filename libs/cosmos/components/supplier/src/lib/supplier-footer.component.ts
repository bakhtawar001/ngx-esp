import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import type { Supplier } from '@smartlink/suppliers';

@Component({
  selector: 'cos-supplier-footer',
  templateUrl: 'supplier-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cos-supplier-footer',
  },
})
export class CosSupplierFooterComponent {
  @Input() supplier!: Supplier;
  public isExpanded = false;

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }
}
