import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import type { Preferred, Rating } from '@smartlink/suppliers';

export interface Supplier {
  Id: number;
  Name: string;
  AsiNumber: string;
  Rating?: Rating;
  Preferred?: Preferred;
}

// export type ThemePalette = 'primary' | 'secondary' | undefined;

@Component({
  selector: 'cos-supplier',
  templateUrl: 'supplier.component.html',
  styleUrls: ['supplier.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cos-supplier',
  },
})
export class CosSupplierComponent {
  imgError = false;

  @Input() showImage = false;
  @Input() showPreferredGroup = false;
  @Input() supplier!: Supplier;

  @Output() detailClick = new EventEmitter<Supplier>();

  errorHandler() {
    this.imgError = true;
  }
}
