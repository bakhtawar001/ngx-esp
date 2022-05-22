# Notification Component

<!-- prettier-ignore-start -->
The notification component exists in two formats, as a toast notification and as an inline notification.

A notification is comprised of the following parts:

cos-notification-icon (optional) a custom icon
cos-notification-title (required) a title block
cos-notification-body (optional) a body block that supports HTML

## Inputs

type = 'string : 'info', 'warn', 'error', 'confirm', 'custom'

## Usage

```angular
<cos-notification [type]="type">
  <cos-notification-icon class="cos-test" *ngIf="showCustomIcon"
    ><div><i class="fa fa-dog"></i></div
  ></cos-notification-icon>
  <cos-notification-title>{{ title }}</cos-notification-title>
  <cos-notification-body>{{ body }}</cos-notification-body>
  <div *ngIf="showButtons">
    <button cos-flat-button (click)="testClick($event)">
      Update Credit Card
    </button>
    <button cos-flat-button [color]="'primary'" (click)="testClick($event)">
      Continue Anyway
    </button>
  </div>
</cos-notification>
```

## Toast Notification

The notification is used alongside with ngneat/hot-toast so that it can display as a toast notification

## Example

1.  Create a component and import the service and add to the constructor

```angular
import { CosToastService } from '@cosmos/components/notification';
constructor(
    private _toastService: CosToastService
  ) { }
```

2.  Add the service action when you need it

```angular
this._collectionsDialogService
      .openCreateDialog(null, true)
      .pipe(
        filter((collection) => !!collection),
        untilDestroyed(this)
      )
      .subscribe({
        next: (collection) => {
          this._router.navigate(['/collections', collection.Id]).then(() => {
            this._toastService.success(
              'Success: Collection created!',
              `Your collection ${collection.Name} has been created.`
            );
          });
        },
        error: () => {
          this._toastService.error(
            'Collection not created.',
            'Collection was unable to be created.'
          );
        },
      });
```
<!-- prettier-ignore-end -->
