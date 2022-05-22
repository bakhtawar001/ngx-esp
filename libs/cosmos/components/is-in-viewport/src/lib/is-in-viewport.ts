import {
  Directive,
  ElementRef,
  EventEmitter,
  NgModule,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { observeElementInViewport } from '@cosmos/core';

@Directive({ selector: '[isInViewport]' })
export class IsInViewportDirective implements OnInit, OnDestroy {
  @Output() isInViewport = new EventEmitter<void>();

  private subscription: Subscription | null = null;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // Caretaker note: we don't wanna use `untilDestroyed()` here since we want to destroy the
    // `IntersectionObserver` once the element occurs inside the viewport.
    this.subscription = observeElementInViewport(
      this.host.nativeElement
    ).subscribe(() => {
      ngDevMode && NgZone.assertNotInAngularZone();
      this.isInViewport.emit();
      this.dispose();
    });
  }

  ngOnDestroy(): void {
    this.dispose();
  }

  private dispose(): void {
    if (this.subscription !== null) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}

@NgModule({
  declarations: [IsInViewportDirective],
  exports: [IsInViewportDirective],
})
export class IsInViewportModule {}
