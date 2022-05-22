import {
  Directive,
  ElementRef,
  EventEmitter,
  Injectable,
  NgModule,
  NgZone,
  Output,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class DocumentClickService extends Subject<MouseEvent> {
  constructor(ngZone: NgZone) {
    super();
    // Caretaker note: this service is shared between multiple `ClickOutsideDirective` instances,
    // so each instance doesn't add new event listeners for the `document` again and again.
    ngZone.runOutsideAngular(() => {
      fromEvent<MouseEvent>(document, 'click')
        .pipe(untilDestroyed(this))
        .subscribe(this);
    });
  }
}

@UntilDestroy()
@Directive({ selector: '[clickOutside]' })
export class ClickOutsideDirective {
  @Output() readonly clickOutside = new EventEmitter<MouseEvent>();

  constructor(
    readonly ngZone: NgZone,
    readonly host: ElementRef<HTMLElement>,
    readonly documentClickService: DocumentClickService
  ) {
    documentClickService
      .pipe(
        filter(
          (event) =>
            event.target instanceof Node &&
            host.nativeElement.contains(event.target) === false
        ),
        untilDestroyed(this)
      )
      .subscribe((event) => {
        ngZone.run(() => this.clickOutside.emit(event));
      });
  }
}

@NgModule({
  declarations: [ClickOutsideDirective],
  exports: [ClickOutsideDirective],
})
export class ClickOutsideModule {}
