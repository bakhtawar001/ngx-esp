import { Injectable, OnDestroy } from '@angular/core';

import { mergeAlias } from './utils';
import { MediaChange } from './media-change';
import { BreakPoint } from './breakpoints/breakpoint';
import {
  BreakPointRegistry,
  OptionalBreakPoint,
} from './breakpoints/breakpoint-registry';
import { orderBy } from 'lodash-es';

/**
 * Interface to apply PrintHook to call anonymous `target.updateStyles()`
 */
export interface HookTarget {
  activatedBreakpoints: BreakPoint[];
  updateStyles(): void;
}

const PRINT = 'print';
export const BREAKPOINT_PRINT = {
  alias: PRINT,
  mediaQuery: PRINT,
  priority: 1000,
};

/**
 * PrintHook - Use to intercept print MediaQuery activations and force
 *             layouts to render with the specified print alias/breakpoint
 *
 * Used in MediaMarshaller and MediaObserver
 */
@Injectable({ providedIn: 'root' })
export class PrintHook implements OnDestroy {
  // registeredBeforeAfterPrintHooks tracks if we registered the `beforeprint`
  //  and `afterprint` event listeners.
  private registeredBeforeAfterPrintHooks = false;

  // isPrintingBeforeAfterEvent is used to track if we are printing from within
  // a `beforeprint` event handler. This prevents the typicall `stopPrinting`
  // form `interceptEvents` so that printing is not stopped while the dialog
  // is still open. This is an extension of the `isPrinting` property on
  // browsers which support `beforeprint` and `afterprint` events.
  private isPrintingBeforeAfterEvent = false;

  private beforePrintEventListeners: EventListenerOrEventListenerObject[] = [];
  private afterPrintEventListeners: EventListenerOrEventListenerObject[] = [];

  /** Is this service currently in Print-mode ? */
  private isPrinting = false;
  private queue: PrintQueue = new PrintQueue();
  private deactivations: BreakPoint[] = [];

  constructor(private breakpoints: BreakPointRegistry) {}

  /** Add 'print' mediaQuery: to listen for matchMedia activations */
  withPrintQuery(queries: string[]): string[] {
    return [...queries, PRINT];
  }

  /** Is the MediaChange event for any 'print' @media */
  isPrintEvent(event: MediaChange): boolean {
    return event.mediaQuery.startsWith(PRINT);
  }

  /** What is the desired mqAlias to use while printing? */
  get printAlias(): string[] {
    return [];
  }

  /** Lookup breakpoints associated with print aliases. */
  get printBreakPoints(): BreakPoint[] {
    return this.printAlias
      .map((alias) => this.breakpoints.findByAlias(alias))
      .filter((bp) => bp !== null) as BreakPoint[];
  }

  /** Lookup breakpoint associated with mediaQuery */
  getEventBreakpoints({ mediaQuery }: MediaChange): BreakPoint[] {
    const bp = this.breakpoints.findByQuery(mediaQuery);
    const list = bp ? [...this.printBreakPoints, bp] : this.printBreakPoints;

    return orderBy(list, [(el) => (el ? el.priority || 0 : 0)], ['desc']);
  }

  /** Update event with printAlias mediaQuery information */
  updateEvent(event: MediaChange): MediaChange {
    let bp: OptionalBreakPoint = this.breakpoints.findByQuery(event.mediaQuery);
    if (this.isPrintEvent(event)) {
      // Reset from 'print' to first (highest priority) print breakpoint
      bp = this.getEventBreakpoints(event)[0];
      event.mediaQuery = bp ? bp.mediaQuery : '';
    }
    return mergeAlias(event, bp);
  }

  // registerBeforeAfterPrintHooks registers a `beforeprint` event hook so we can
  // trigger print styles synchronously and apply proper layout styles.
  // It is a noop if the hooks have already been registered.
  private registerBeforeAfterPrintHooks(target: HookTarget) {
    if (this.registeredBeforeAfterPrintHooks) {
      return;
    }

    this.registeredBeforeAfterPrintHooks = true;

    const beforePrintListener = () => {
      // If we aren't already printing, start printing and update the styles as
      // if there was a regular print `MediaChange`(from matchMedia).
      if (!this.isPrinting) {
        this.isPrintingBeforeAfterEvent = true;
        this.startPrinting(
          target,
          this.getEventBreakpoints(new MediaChange(true, PRINT))
        );
        target.updateStyles();
      }
    };

    const afterPrintListener = () => {
      // If we aren't already printing, start printing and update the styles as
      // if there was a regular print `MediaChange`(from matchMedia).
      this.isPrintingBeforeAfterEvent = false;
      if (this.isPrinting) {
        this.stopPrinting(target);
        target.updateStyles();
      }
    };

    // Could we have teardown logic to remove if there are no print listeners being used?
    window.addEventListener('beforeprint', beforePrintListener);
    window.addEventListener('afterprint', afterPrintListener);

    this.beforePrintEventListeners.push(beforePrintListener);
    this.afterPrintEventListeners.push(afterPrintListener);
  }

  /**
   * Prepare RxJS filter operator with partial application
   * @return pipeable filter predicate
   */
  interceptEvents(target: HookTarget) {
    this.registerBeforeAfterPrintHooks(target);

    return (event: MediaChange) => {
      if (this.isPrintEvent(event)) {
        if (event.matches && !this.isPrinting) {
          this.startPrinting(target, this.getEventBreakpoints(event));
          target.updateStyles();
        } else if (
          !event.matches &&
          this.isPrinting &&
          !this.isPrintingBeforeAfterEvent
        ) {
          this.stopPrinting(target);
          target.updateStyles();
        }
      } else {
        this.collectActivations(event);
      }
    };
  }

  /** Stop mediaChange event propagation in event streams */
  blockPropagation() {
    return (event: MediaChange): boolean => {
      return !(this.isPrinting || this.isPrintEvent(event));
    };
  }

  /**
   * Save current activateBreakpoints (for later restore)
   * and substitute only the printAlias breakpoint
   */
  protected startPrinting(target: HookTarget, bpList: OptionalBreakPoint[]) {
    this.isPrinting = true;
    target.activatedBreakpoints = this.queue.addPrintBreakpoints(bpList);
  }

  /** For any print de-activations, reset the entire print queue */
  protected stopPrinting(target: HookTarget) {
    target.activatedBreakpoints = this.deactivations;
    this.deactivations = [];
    this.queue.clear();
    this.isPrinting = false;
  }

  /**
   * To restore pre-Print Activations, we must capture the proper
   * list of breakpoint activations BEFORE print starts. OnBeforePrint()
   * is supported; so 'print' mediaQuery activations are used as a fallback
   * in browsers without `beforeprint` support.
   *
   * >  But activated breakpoints are deactivated BEFORE 'print' activation.
   *
   * Let's capture all de-activations using the following logic:
   *
   *  When not printing:
   *    - clear cache when activating non-print breakpoint
   *    - update cache (and sort) when deactivating
   *
   *  When printing:
   *    - sort and save when starting print
   *    - restore as activatedTargets and clear when stop printing
   */
  collectActivations(event: MediaChange) {
    if (!this.isPrinting || this.isPrintingBeforeAfterEvent) {
      if (!event.matches) {
        const bp = this.breakpoints.findByQuery(event.mediaQuery);
        if (bp) {
          // Deactivating a breakpoint
          this.deactivations.push(bp);
          this.deactivations = orderBy(
            this.deactivations,
            [(el) => (el ? el.priority || 0 : 0)],
            ['desc']
          );
        }
      } else if (!this.isPrintingBeforeAfterEvent) {
        // Only clear deactivations if we aren't printing from a `beforeprint` event.
        // Otherwise this will clear before `stopPrinting()` is called to restore
        // the pre-Print Activations.
        this.deactivations = [];
      }
    }
  }

  /** Teardown logic for the service. */
  ngOnDestroy() {
    while (this.beforePrintEventListeners.length) {
      window.removeEventListener(
        'beforeprint',
        this.beforePrintEventListeners.pop()!
      );
    }
    while (this.afterPrintEventListeners.length) {
      window.removeEventListener(
        'afterprint',
        this.afterPrintEventListeners.pop()!
      );
    }
  }
}

// ************************************************************************
// Internal Utility class 'PrintQueue'
// ************************************************************************

/**
 * Utility class to manage print breakpoints + activatedBreakpoints
 * with correct sorting WHILE printing
 */
class PrintQueue {
  /** Sorted queue with prioritized print breakpoints */
  printBreakpoints: BreakPoint[] = [];

  addPrintBreakpoints(bpList: OptionalBreakPoint[]): BreakPoint[] {
    bpList.push(BREAKPOINT_PRINT);
    bpList = orderBy(bpList, [(el) => (el ? el.priority || 0 : 0)], ['desc']);
    bpList.forEach((bp) => this.addBreakpoint(bp));

    return this.printBreakpoints;
  }

  /** Add Print breakpoint to queue */
  addBreakpoint(bp: OptionalBreakPoint) {
    if (bp) {
      const bpInList = this.printBreakpoints.find(
        (it) => it.mediaQuery === bp.mediaQuery
      );
      if (bpInList === undefined) {
        // If this is a `printAlias` breakpoint, then append. If a true 'print' breakpoint,
        // register as highest priority in the queue
        this.printBreakpoints = isPrintBreakPoint(bp)
          ? [bp, ...this.printBreakpoints]
          : [...this.printBreakpoints, bp];
      }
    }
  }

  /** Restore original activated breakpoints and clear internal caches */
  clear() {
    this.printBreakpoints = [];
  }
}

// ************************************************************************
// Internal Utility methods
// ************************************************************************

/** Only support intercept queueing if the Breakpoint is a print @media query */
function isPrintBreakPoint(bp: OptionalBreakPoint) {
  return bp ? bp.mediaQuery.startsWith(PRINT) : false;
}
