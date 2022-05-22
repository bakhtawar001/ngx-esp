/// <reference types="jest" />

import { Observable, of } from 'rxjs';

import { getZoneUnPatchedApi } from '@cosmos/zone-less';

/**
 * The `observeElementInViewport` function should always use the unpatched API to avoid triggering global
 * change detections. The developer may want to re-enter Angular's zone manually through `ngZone.run()`,
 * but it's better to run the local change detection through `ref.detectChanges()`.
 *
 * We have to mock the `IntersectionObserver` when running Jest tests since the viewport isn't available.
 */
const IntersectionObserver =
  ngDevMode && typeof jest !== 'undefined'
    ? (() => {
        const observe = jest.fn();
        const unobserve = jest.fn();
        const disconnect = jest.fn();
        return jest.fn(() => ({ observe, unobserve, disconnect }));
      })()
    : getZoneUnPatchedApi('IntersectionObserver');

export function observeElementInViewport(
  element: HTMLElement,
  threshold?: number | number[],
  rootMargin?: string
): Observable<boolean> {
  if (typeof IntersectionObserver !== 'function') {
    return of(true);
  }

  return new Observable((observer) => {
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        const isIntersecting =
          entry.isIntersecting || entry.intersectionRatio > 0;
        if (isIntersecting) {
          observer.next(true);
          observer.complete();
        }
      },
      { threshold, rootMargin }
    );

    io.observe(element);

    return () => {
      io.disconnect();
    };
  });
}
