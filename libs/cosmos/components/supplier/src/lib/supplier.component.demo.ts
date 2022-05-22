import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-supplier-demo-component',
  template: `
    <cos-supplier
      [showImage]="showImage"
      [showPreferredGroup]="showPreferredGroup"
      [supplier]="supplier"
    >
      <cos-supplier-footer
        *ngIf="showDetails"
        [supplier]="supplier"
      ></cos-supplier-footer>
    </cos-supplier>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosSupplierDemoComponent {
  @Input() supplierName;
  @Input() supplierId;
  @Input() asiNumber;
  @Input() starRating;
  @Input() totalCount;
  @Input() preferredGroup;

  @Input() supplier: string;
  @Input() showImage: boolean;
  @Input() showDetails: boolean;
  @Input() showPreferredGroup: boolean;
}
