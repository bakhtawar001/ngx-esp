import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CosButtonModule } from '@cosmos/components/button';
import { AttributeTag } from '@cosmos/components/product-card-tags';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { Dictionary } from '@cosmos/core';
import { arg } from '@cosmos/storybook';
import { Meta } from '@storybook/angular';
import markdown from './product-card.md';
import { CosProductCardModule } from './product-card.module';

const statusOptions = {
  None: {},
  Cart: {
    Icon: 'shopping-cart',
    Label: 'In Cart',
    Color: 'blue',
    Type: 'inCart',
  },
  Viewed: { Icon: 'eye', Label: 'Viewed', Color: 'gray', Type: 'viewed' },
  Disliked: {
    Icon: 'thumbs-down',
    Label: 'Disliked',
    Color: 'red',
    Type: 'disliked',
  },
  Unavailable: { Label: 'No longer available', Type: 'unavailable' },
};

const productsList = [
  {
    Id: 22624610,
    Name: 'White Barrel European Design Ballpoint Pen',
    Number: 'FLWR-E',
    ImageUrl: 'media/22624610',
    VariantTag: null,
    Supplier: {
      Id: 3307,
      Name: 'Graphco line',
      AsiNumber: '57956',
      Preferred: {
        Name: 'Gold',
      },
      Rating: {
        Rating: 10,
        Companies: 12,
        Transactions: 12,
      },
    },
    Price: {
      Quantity: 200,
      Price: 0.53,
      Cost: 0.318,
      DiscountCode: 'R',
      CurrencyCode: 'USD',
      PreferredPrice: 0.25,
    },
    IsAd: true,
    AttributeTags: [
      {
        Icon: 'exclamation-triangle',
        Label: 'Prop65/Hazard',
      },
    ],
  },
  {
    Id: 5443048,
    Name: 'Engraved Golden Compass',
    Number: 'FLWR-E',
    ImageUrl: 'media/5443048',
    VariantTag: null,
    Supplier: {
      Id: 3307,
      Name: 'Graphco line',
      AsiNumber: '57956',
      Preferred: {
        Name: 'Gold',
      },
      Rating: {
        Rating: 10,
        Companies: 12,
        Transactions: 12,
      },
    },
    Price: {
      Quantity: 200,
      Price: 0.53,
      Cost: 0.318,
      DiscountCode: 'R',
      CurrencyCode: 'USD',
      PreferredPrice: 0.25,
    },
    IsAd: true,
    AttributeTags: [
      {
        Icon: 'exclamation-triangle',
        Label: 'Prop65/Hazard',
      },
    ],
  },
  {
    Id: 5443049,
    Name: 'White Barrel European Design Ballpoint Pen',
    Number: 'FLWR-E',
    ImageUrl: 'media/22624610',
    VariantTag: null,
    Supplier: {
      Id: 3307,
      Name: 'Graphco line',
      AsiNumber: '57956',
      Preferred: {
        Name: 'Gold',
      },
      Rating: {
        Rating: 10,
        Companies: 12,
        Transactions: 12,
      },
    },
    Price: {
      Quantity: 200,
      Price: 0.53,
      Cost: 0.318,
      DiscountCode: 'R',
      CurrencyCode: 'USD',
      PreferredPrice: 0.25,
    },
    IsAd: true,
    AttributeTags: [
      {
        Icon: 'exclamation-triangle',
        Label: 'Prop65/Hazard',
      },
    ],
  },
  {
    Id: 5443050,
    Name: 'White Barrel European Design Ballpoint Pen',
    Number: 'FLWR-E',
    ImageUrl: 'media/22624610',
    VariantTag: null,
    Supplier: {
      Id: 3307,
      Name: 'Graphco line',
      AsiNumber: '57956',
      Preferred: {
        Name: 'Gold',
      },
      Rating: {
        Rating: 10,
        Companies: 12,
        Transactions: 12,
      },
    },
    Price: {
      Quantity: 200,
      Price: 0.53,
      Cost: 0.318,
      DiscountCode: 'R',
      CurrencyCode: 'USD',
      PreferredPrice: 0.25,
    },
    IsAd: true,
    AttributeTags: [
      {
        Icon: 'exclamation-triangle',
        Label: 'Prop65/Hazard',
      },
    ],
  },
];

const attributeTags: AttributeTag[] = [
  {
    Icon: 'fire-alt',
    Label: 'Best Seller',
  },
  {
    Icon: 'dolly',
    Label: 'Closeout Product',
  },
  {
    Icon: 'exclamation-circle ',
    Label: 'New Product',
  },
  {
    Icon: 'sync-alt',
    Label: 'Data Fresh',
  },
  {
    Icon: 'tag',
    Label: 'Special',
  },
  {
    Icon: 'flag-usa',
    Label: 'Made in the USA',
  },
  {
    Icon: 'gift',
    Label: 'Gifts and Incentive',
  },
  {
    Icon: 'shipping-fast',
    Label: 'Fast/Rush Shipping',
  },
  {
    Icon: 'palette',
    Label: 'Printing Options',
  },
  {
    Icon: 'exclamation-triangle',
    Label: 'Prop65/Hazard',
  },
];

const attributeTagOptions = attributeTags.reduce(
  (acc: Dictionary<string>, tag, i) => {
    acc[i] = tag.Label;
    return acc;
  },
  {}
);

@Component({
  selector: 'cos-product-card-demo-component',
  template: `
    <div style="max-width: 184px;">
      <cos-product-card
        [status]="status"
        [product]="product"
        selectLabel="Select"
        [clientFacing]="clientFacing"
        [suppressActions]="suppressActions"
        [selected]="selected"
        [productActionsTemplate]="productCardActions"
        (selectedChanged)="updateSelected($event)"
      >
        <cos-supplier
          *ngIf="showSupplier"
          [supplier]="product.Supplier"
          [showImage]="showImage"
          [showPreferredGroup]="showPreferredGroup"
        ></cos-supplier>
      </cos-product-card>

      <ng-template #productCardActions let-product="product">
        <!-- Add to collection button -->
        <button mat-menu-item class="cos-menu-item">
          <i class="fa fa-archive"></i>
          <span>Add to Collection </span>
        </button>
        <!-- /Add to collection button -->
      </ng-template>
      <p>Product is selected: {{ selected === true }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosProductCardDemoComponent {
  @Input() name: string;
  @Input() variants;
  @Input() isAd;
  @Input() attributeTags;
  @Input() selected;
  @Input() status;

  @Input() clientFacing: boolean;
  @Input() showSupplier: boolean;
  @Input() showImage: boolean;
  @Input() showPreferredGroup: boolean;
  @Input() suppressActions: boolean;

  updateSelected(event) {
    this.selected = event;
  }

  get product() {
    const AttributeTags = this.attributeTags.map((i) => attributeTags[i]);

    return {
      Id: 5443047,
      Name: this.name,
      Number: 'FLWR-E',
      ImageUrl: 'media/22624610',
      VariantTag: this.variants,
      Supplier: {
        Id: 7730,
        Name: 'Graphco line',
        AsiNumber: '57956',
        Preferred: {
          Name: 'Gold',
        },
        Ratings: {
          OverAll: { Rating: 9, Companies: 41, Transactions: 247 },
          Quality: { Rating: 9, Companies: 36, Transactions: 206 },
          Communication: { Rating: 9, Companies: 35, Transactions: 202 },
          Delivery: { Rating: 9, Companies: 34, Transactions: 201 },
          ConflictResolution: { Rating: 8, Companies: 13, Transactions: 133 },
          Decoration: { Rating: 9, Companies: 34, Transactions: 201 },
        },
      },
      Price: {
        Quantity: 200,
        Price: 0.53,
        Cost: 0.318,
        DiscountCode: 'R',
        CurrencyCode: 'USD',
        PreferredPrice: 0.25,
      },
      IsAd: this.isAd,
      AttributeTags,
    };
  }
}

// Draggable demo component
@Component({
  selector: 'cos-product-card-draggable-demo',
  template: `
    <div
      class="cos-product-card-drag-boundary"
      cdkDropList
      cdkDropListOrientation="horizontal"
      (cdkDropListDropped)="drop($event)"
    >
      <cos-product-card
        *ngFor="let product of products"
        selectLabel="Select"
        [isDraggable]="enableDragging"
        [product]="product"
        [status]="status"
      >
      </cos-product-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CosProductCardDraggableDemoComponent {
  @Input() name;
  @Input() variants;
  @Input() isAd;
  @Input() attributeTags;
  @Input() selected;

  @Input() enableDragging: boolean;

  get status() {
    return { Icon: 'shopping-cart', Label: 'In Cart', Color: 'blue' };
  }

  products = productsList;

  updateSelected(event) {
    this.selected = event;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.products, event.previousIndex, event.currentIndex);
  }
}

export default {
  title: 'Objects/Product Card',
  parameters: {
    notes: markdown,
  },
  args: {
    status: 'Cart',
    name: 'White Barrel European Design Ballpoint Pen',
    variants: '15 colors',
    attributeTags: [2, 9],
    showSupplier: true,
    showPreferredGroup: true,
  },
  argTypes: {
    status: {
      name: 'Status',
      options: Object.keys(statusOptions),
      mapping: statusOptions,
      control: 'select',
    },
    name: arg('Name'),
    variants: arg('Variants'),
    isAd: arg('Ad', 'boolean'),
    attributeTags: {
      name: 'Attribute Tags',
      options: Object.keys(attributeTagOptions).map((i) => +i),
      mapping: attributeTagOptions,
      control: { type: 'multi-select', labels: attributeTagOptions },
    },
    selected: arg('Selected', 'boolean'),
    showSupplier: arg('Show Supplier', 'boolean'),
    showImage: arg('Show Image', 'boolean'),
    showPreferredGroup: arg('Show Preferred Group', 'boolean'),
    suppressActions: arg('Hide Actions', 'boolean'),
    enableDragging: arg('Enable Dragging', 'boolean'),
  },
} as Meta;

export const primary = (props) => ({
  moduleMetadata: {
    declarations: [CosProductCardDemoComponent],
    imports: [
      BrowserAnimationsModule,
      CosProductCardModule,
      CosSupplierModule,
      CosButtonModule,
    ],
  },
  component: CosProductCardDemoComponent,
  props,
});

export const withoutSupplier = (props) => ({
  moduleMetadata: {
    declarations: [CosProductCardDemoComponent],
    imports: [
      BrowserAnimationsModule,
      CosProductCardModule,
      CosSupplierModule,
      CosButtonModule,
    ],
  },
  component: CosProductCardDemoComponent,
  props,
});

withoutSupplier.args = {
  showSupplier: false,
};

export const clientFacing = (props) => ({
  moduleMetadata: {
    declarations: [CosProductCardDemoComponent],
    imports: [
      BrowserAnimationsModule,
      CosProductCardModule,
      CosSupplierModule,
      CosButtonModule,
    ],
  },
  component: CosProductCardDemoComponent,
  props: { ...props, clientFacing: true },
});

clientFacing.args = {
  showSupplier: false,
};

export const clientFacingFullWidth = (props) => ({
  moduleMetadata: {
    declarations: [CosProductCardDemoComponent],
    imports: [
      BrowserAnimationsModule,
      CosProductCardModule,
      CosSupplierModule,
      CosButtonModule,
    ],
  },
  component: CosProductCardDemoComponent,
  props: { ...props, clientFacing: true },
});

clientFacingFullWidth.args = {
  showSupplier: false,
};

export const draggable = (props) => ({
  moduleMetadata: {
    declarations: [CosProductCardDraggableDemoComponent],
    imports: [
      BrowserAnimationsModule,
      DragDropModule,
      CosProductCardModule,
      CosSupplierModule,
    ],
  },
  component: CosProductCardDraggableDemoComponent,
  props,
});

draggable.args = {
  enableDragging: true,
};
