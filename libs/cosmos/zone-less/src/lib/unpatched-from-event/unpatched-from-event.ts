import { fromEventPattern, Observable } from 'rxjs';

import { getZoneUnPatchedApi } from '../get-zone-unpatched-api';

/**
 * @description This functions aims to mimic the `fromEvent` behavior since it also returns an observable that emits
 * events dispatched on the event target.
 * The difference is that it uses the unpatched DOM API, which is not patched by zone.js, thus not even
 * going through the zone.js task lifecycle. You can also access the native DOM API as follows:
 * ```ts
 * TARGET[Zone.__symbol__(ORIGINAL_METHOD_NAME)]
 * ```
 * For instance:
 * ```ts
 * const unpatchedDocumentAddEventListener = document[Zone.__symbol__('addEventListener')].bind(document);
 * unpatchedDocumentAddEventListener.call(document, 'click', () => {
 *   console.log('This handler has been added using the unpatched API!');
 * });
 *
 * document.addEventListener !== document[Zone.__symbol__('addEventListener')]; // true
 * ```
 *
 * This simply can be used in the same way as the `fromEvent`.
 * Remember that it'll add event listeners through the unpatched DOM API, which means these event listeners
 * will not trigger the change detection (after invokations), so you'll need to start it on your own (if needed).
 *
 * It's better to use unpatched `fromEvent` since `addEventListener` will still go through the zone.js
 * internal API since the zone.js does many checks internally. It won't trigger the change detection, but a root
 * zone also runs event task through its lifecycle.
 *
 * This helps to avoid the `NgZone + fromEvent` boilerplate, for instance:
 * ```ts
 * constructor(private host: ElementRef<HTMLElement>) {}
 *
 * ngOnInit(): void {
 *   unpatchedFromEvent(this.host.nativeElement, 'click').pipe(untilDestroyed(this)).subscribe(() => {
 *     console.log(Zone.current); // <root>
 *   });
 * }
 * ```
 */
export function unpatchedFromEvent<T extends Event>(
  target: EventTarget,
  eventName: string
): Observable<T> {
  return fromEventPattern(
    (handler) =>
      getZoneUnPatchedApi(target, 'addEventListener').call(
        target,
        eventName,
        handler
      ),
    (handler) =>
      getZoneUnPatchedApi(target, 'removeEventListener').call(
        target,
        eventName,
        handler
      )
  );
}
