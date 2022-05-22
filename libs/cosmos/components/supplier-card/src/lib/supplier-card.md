# Supplier View

Supplier cards are used to display summary information about suppliers.

## When to use this component

Can be used on their own on a page to display like in search results.

---

```html
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
```
