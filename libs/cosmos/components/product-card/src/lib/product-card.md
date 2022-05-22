# Product Views

Product cards are used to display summary information about products.

### When to use this component

Can be used as part of other components, like a product gallery, or on their own on a page to display like in search results, collections, or presentations.

---

```html
<cos-product-card
  [product]="product"
  [size]="size"
  selectedLabel="localized string"
  [selected]="boolean"
>
  <cos-supplier
    *ngIf="showSupplier"
    [supplier]="product.Supplier"
    [showImage]="showImage"
    [showPreferredGroup]="showPreferredGroup"
  ></cos-supplier>
</cos-product-card>
```

_Normal with product actions_

```html
<cos-product-card
  [product]="product"
  [size]="size"
  selectedLabel="localized string"
  [selected]="boolean"
  [productActionsTemplate]="productCardActions"
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
  <button
    mat-menu-item
    class="cos-menu-item add-to-collection"
    (click)="addToCollection(product)"
  >
    <i class="fa fa-archive"></i>
    <span>Add to Collection </span>
  </button>
  <!-- /Add to collection button -->
</ng-template>
```

_Normal without Supplier_

```html
<cos-product-card [product]="product"> </cos-product-card>
```

_Small_

```html
<cos-product-card [product]="product" size="small">
  <cos-supplier
    [supplier]="product.Supplier"
    showPreferredGroups="false"
  ></cos-supplier>
</cos-product-card>
```

Data structure example:

```js
{
    Id: 5443047,
    Name: 'Generic Pen',
    Number: 'ABC123,
    ImageUrl: 'media/22624610',
    Attributes: '12 Colors,
    Supplier: {
        Id: 3307,
        Name: 'Graphco line',
        AsiNumber: '57956',
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
            Icon: 'fire-alt',
            Label: 'Best Seller',
        },
        {
            Icon: 'dolly',
            Label: 'Closeout Product',
        }
    ],
    Status: {
      Icon: 'shopping-cart',
      Label: 'In Cart',
      Color: 'blue'
    }
};

```

## Drag and Drop

The Product Card is draggable on hover, and it utilizes [Material's CDK for the drag and drop module](https://material.angular.io/cdk/drag-drop/overview).

### How to use

By default, drag and drop is disabled on Product Cards. You can enable cards to be dragged by passing a `true` to the `isDraggable` input.

In addition, product cards look for a container with the `.cos-product-card-drag-boundary` class and the `cdkDragList` directive from `@angular/cdk/drag-drop` applied to restrict their dragging within a predictable area ([see example](http://localhost:4400/?path=/story/product-card--draggable)). [Read more about `cdkDragList`.](https://material.angular.io/cdk/drag-drop/overview#reordering-lists).

Currently, the Material CDK assumes either a [vertical or horizontal dragging orientation](https://material.angular.io/cdk/drag-drop/overview#list-orientation) along a list, does not support mixed orientation. This is a limitation in the implementation and as of this writing, it is an [open feature request](https://github.com/angular/components/issues/13372).

---

## How it works

### Small

This view is used in other components to display a group of products within a product gallery.

Small Product View:

- Product image
- Product name
- Supplier Name
- ASI Number
- Star rating

### Primary / Standard

This view is used when products are displayed in a list on their own page such as in search results, collections, or presentations.

Standard Product View:

- Checkbox
  - When selected, displays the contextual action bar and displays bulk contextual product actions
  - This is hidden in the customer experience
- Three-dot (meatball) menu
  - Used to display contextual product actions
- Photo
- Number of colors
- Product Name
- Unit pricing
- Up to 2 system tags
- Small supplier card
  - This is hidden on the customer experience or in client safe mode

##### System Tags

When these appear on a product card they can be system generated. On the product page a supplier can also choose from certain tags to add to a product. To view list of tags see abstract [here](https://share.goabstract.com/d9731f54-eb5f-41f8-a67c-6465202be1fe?collectionLayerId=d6355d09-f290-40a9-83e7-cb636a866cb9&mode=design)

##### Ad Badge

Only show the ad indicator where the product was paid to display. Ads are not shown in collections, presentation, orders, etc or when you are in a flow to add products.

---

### States

Hover state is an applied drop show of G25-Moth. ( 0 px, 1 px, 10px, 0px)

---
