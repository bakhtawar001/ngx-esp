import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { ResizeObserverServiceCallback } from './types';

@Injectable()
export class ResizeObserverService implements OnDestroy {
  // Private
  private elementMap = new Map<Element, ResizeObserverServiceCallback>();
  private observer: ResizeObserver | null = null;

  /**
   *
   * @param {NgZone} _ngZone
   */
  constructor(private readonly _ngZone: NgZone) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On destroy
   */
  ngOnDestroy() {
    this.clearObserver();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  isObserving(element: Element) {
    const hasEntry = this.elementMap.has(element);

    return hasEntry;
  }

  observe(
    element: Element,
    callback: ResizeObserverServiceCallback,
    options?: ResizeObserverOptions
  ) {
    if (!this.observer) {
      this.setObserver();
    }

    this.observer!.observe(element, options);
    this.elementMap.set(element, callback);
  }

  unobserve(element: Element) {
    if (this.isObserving(element)) {
      this.observer!.unobserve(element);
      this.elementMap.delete(element);

      if (this.elementMap.size === 0) {
        this.clearObserver();
      }
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private clearObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.elementMap = new Map<Element, ResizeObserverServiceCallback>();
  }

  private setObserver() {
    this.observer = new ResizeObserver((resizes) => {
      for (const resize of resizes) {
        const cb = this.elementMap.get(resize.target);

        if (cb) {
          this._ngZone.run(() => {
            cb(resize);
          });
        }
      }
    });
  }
}
