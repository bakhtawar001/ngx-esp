### `isInViewport`

An attribute directive that can be bound to a host element and emit an event when a host element occurs within the viewport:

```html
<div (isInViewport)="doSomethingWhenThisDivIsWithinTheViewport()"></div>
```

It's exported from the `IsInViewportModule`:

```ts
import { IsInViewportModule } from '@cosmos/components/is-in-viewport';

@NgModule({
  imports: [IsInViewportModule],
})
export class AppModule {}
```

It setups an `IntersectionObserver` internally; it uses the unpatched `IntersectionObserver`. This means that the `isInViewport` event is emitted outside of the Angular zone:

```ts
@Component({
  selector: 'app-root',
  template:
    '<div (isInViewport)="doSomethingWhenThisDivIsWithinTheViewport()"></div>',
})
export class AppComponent {
  doSomethingWhenThisDivIsWithinTheViewport(): void {
    console.log(Zone.current); // <root>
    console.log(NgZone.isInAngularZone()); // false
  }
}
```

If you'd want to do some template related logic, e.g. run change detection, then you need to re-enter the Angular zone:

```ts
@Component({
  selector: 'app-root',
  template: `
    <div (isInViewport)="doSomethingWhenThisDivIsWithinTheViewport()"></div>
    <app-some-component *ngIf="isDivWithinTheViewport"></app-some-component>
  `,
})
export class AppComponent {
  isDivWithinTheViewport = false;

  constructor(private ref: ChangeDetectorRef, private ngZone: NgZone) {}

  doSomethingWhenThisDivIsWithinTheViewport(): void {
    this.ngZone.run(() => {
      this.isDivWithinTheViewport = true;
      this.ref.detectChanges();
    });
  }
}
```
