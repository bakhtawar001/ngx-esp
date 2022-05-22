// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import supplierLogoNotFoundUrl from '!!file-loader?name=[name].[contenthash].jpg!../../../../../cosmos/assets/images/supplier_logo_not_found.png';
// The `supplierLogoNotFoundUrl` will be actual URL to the image, e.g. `mage_not_in_catalog.92ede7f05b8f51dc3353c199f5c811db.jpg`.
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { SupplierCard } from './supplier-card';

@Component({
  selector: 'cos-supplier-card',
  templateUrl: './supplier-card.component.html',
  styleUrls: ['./supplier-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosSupplierCardComponent {
  imgError = false;
  @Input() supplier!: SupplierCard;
  @Input() hideContextMenu = false;
  @Input() showTags = false;
  @Output() viewProducts = new EventEmitter<void>();

  onImageError(event: ErrorEvent) {
    const target = <HTMLImageElement>event.target;
    target.src = supplierLogoNotFoundUrl;
  }

  errorHandler() {
    this.imgError = true;
  }
}
