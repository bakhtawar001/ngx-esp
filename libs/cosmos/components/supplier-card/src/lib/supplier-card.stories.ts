import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { arg } from '@cosmos/storybook';
import { SuppliersMockDb } from '@smartlink/suppliers/mocks';
import { Meta } from '@storybook/angular';
import { CosSupplierCardModule, SupplierTag } from '..';
import markdown from './supplier-card.md';

const supplierList = SuppliersMockDb.suppliers;

const supplierTags: SupplierTag[] = [
  { Label: 'Top 40 Supplier', Icon: 'trophy' },
];

@Component({
  selector: 'cos-supplier-card-demo-component',
  template: `
    <div style="max-width: 184px;">
      <cos-supplier-card
        [supplier]="supplier"
        [hideContextMenu]="hideContextMenu"
        [showTags]="showTags"
      >
        <cos-supplier
          [supplier]="supplier"
          [showImage]="showImage"
          [showPreferredGroup]="showPreferredGroup"
        ></cos-supplier>
      </cos-supplier-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosSupplierCardDemoComponent {
  @Input() hideContextMenu: boolean;
  @Input() showTags: boolean;
  @Input() showImage: boolean;
  @Input() showPreferredGroup: boolean;

  get supplier() {
    return {
      ...supplierList[0],
      Rating: {
        Rating: 9,
        Companies: 41,
        Transactions: 247,
      },
      SupplierTags: supplierTags,
    };
  }
}

@Component({
  selector: 'cos-supplier-card-no-rating-demo-component',
  template: `
    <div style="max-width: 184px;">
      <cos-supplier-card
        [supplier]="supplier"
        [hideContextMenu]="hideContextMenu"
        [showTags]="showTags"
      >
        <cos-supplier
          [supplier]="supplier"
          [showImage]="showImage"
          [showPreferredGroup]="showPreferredGroup"
        ></cos-supplier>
      </cos-supplier-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosSupplierCardNoRatingDemoComponent {
  @Input() hideContextMenu: boolean;
  @Input() showTags: boolean;
  @Input() showImage: boolean;
  @Input() showPreferredGroup: boolean;

  get supplier() {
    return {
      ...supplierList[0],
      Rating: null,
      SupplierTags: supplierTags,
    };
  }
}

export default {
  title: 'Objects/Supplier Card',
  parameters: {
    notes: markdown,
  },
  args: {
    hideContextMenu: false,
    showTags: true,
    showImage: false,
    showPreferredGroup: false,
  },
  argTypes: {
    hideContextMenu: arg('Hide Context Menu', 'boolean'),
    showTags: arg('Show Tags', 'boolean'),
    showImage: arg('Show Image', 'boolean'),
    showPreferredGroup: arg('Show Preferred Group', 'boolean'),
  },
} as Meta;

export const primary = (props) => ({
  moduleMetadata: {
    declarations: [CosSupplierCardDemoComponent],
    imports: [
      BrowserAnimationsModule,
      CosSupplierCardModule,
      CosSupplierModule,
    ],
  },
  component: CosSupplierCardDemoComponent,
  props,
});

export const withoutRating = (props) => ({
  moduleMetadata: {
    declarations: [CosSupplierCardNoRatingDemoComponent],
    imports: [
      BrowserAnimationsModule,
      CosSupplierCardModule,
      CosSupplierModule,
    ],
  },
  component: CosSupplierCardNoRatingDemoComponent,
  props,
});
