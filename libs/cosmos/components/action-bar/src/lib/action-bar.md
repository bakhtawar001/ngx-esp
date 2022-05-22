# Contextual Action Bar

The Contextual Action Bar (CAB) contains page level actions and information that apply to the current selections made on the page.

## How it's used

There are two primary instances where a contextual action bar is used:

1. **Bulk actions triggered by checkbox selection.** Bulk actions must match the actions contained within the three-dot (meatball) menu and the page level actions that apply to the entity that is being selected.
2. **Anchor link navigation and page level information within a long form.** The is best demonstrated on the Edit Product page within a Quote.

## Usage

```html
<cos-action-bar>
  <div class="card-actions">
    <cos-checkbox
      class="checkbox-products"
      id="checkbox-products"
      name="checkbox-products"
    >
      <span cosPill>1</span> Product Selected
    </cos-checkbox>

    <cos-action-bar-controls>
      {{ showMenu }}
      <button cos-stroked-button color="warn" (click)="testClick()">
        Remove from collection
      </button>

      <button cos-stroked-button color="primary" (click)="testClick()">
        <i class="fa fa-copy mr-8"></i>
        Copy to new collection
      </button>

      <button cos-flat-button color="primary" (click)="testClick()">
        <i class="fa fa-archive mr-8"></i> Use in presentation
      </button>
    </cos-action-bar-controls>
  </div>
</cos-action-bar>
```

---

### Visual Guidelines

The Contextual Action Bar is always displayed as a sticky footer. If other sticky elements exist display them above or beneath the CAB depending on page level hierarchy. For example, the mobile navigation is displayed beneath the CAB becuase of it's higher level of hierarchy.
