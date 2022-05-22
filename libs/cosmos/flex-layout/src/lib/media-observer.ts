import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, asapScheduler, of } from 'rxjs';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';

import { mergeAlias } from './utils';
import { PrintHook } from './print-hook';
import { MatchMedia } from './match-media';
import { MediaChange } from './media-change';
import {
  BreakPointRegistry,
  OptionalBreakPoint,
} from './breakpoints/breakpoint-registry';
import { orderBy } from 'lodash-es';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class MediaObserver {
  private readonly media$: Observable<MediaChange>;

  constructor(
    private printHook: PrintHook,
    private matchMedia: MatchMedia,
    private breakpoints: BreakPointRegistry
  ) {
    this.media$ = this.watchActivations().pipe(
      filter((changes: MediaChange[]) => changes.length > 0),
      map((changes: MediaChange[]) => changes[0])
    );
  }

  asObservable(): Observable<MediaChange> {
    return this.media$;
  }

  /**
   * Allow programmatic query to determine if one or more media query/alias match
   * the current viewport size.
   * @param value One or more media queries (or aliases) to check.
   * @returns Whether any of the media queries match.
   */
  isActive(value: string | string[]): boolean {
    const aliases = splitQueries(coerceArray(value));
    return aliases.some((alias) => {
      const query = toMediaQuery(alias, this.breakpoints);
      return query !== null && this.matchMedia.isActive(query);
    });
  }

  /**
   * Register all the mediaQueries registered in the BreakPointRegistry
   * This is needed so subscribers can be auto-notified of all standard, registered
   * mediaQuery activations
   */
  private watchActivations() {
    const queries = this.breakpoints.items.map((bp) => bp.mediaQuery);
    return this.buildObservable(queries);
  }

  /**
   * Only pass/announce activations (not de-activations)
   *
   * Since multiple-mediaQueries can be activation in a cycle,
   * gather all current activations into a single list of changes to observers
   *
   * Inject associated (if any) alias information into the MediaChange event
   * - Exclude mediaQuery activations for overlapping mQs. List bounded mQ ranges only
   * - Exclude print activations that do not have an associated mediaQuery
   *
   * NOTE: the raw MediaChange events [from MatchMedia] do not
   *       contain important alias information; as such this info
   *       must be injected into the MediaChange
   */
  private buildObservable(mqList: string[]): Observable<MediaChange[]> {
    function hasChanges(changes: MediaChange[]): boolean {
      const isValidQuery = (change: MediaChange) =>
        change.mediaQuery.length > 0;
      return changes.filter(isValidQuery).length > 0;
    }

    return this.matchMedia.observe(this.printHook.withPrintQuery(mqList)).pipe(
      filter((change: MediaChange) => change.matches),
      debounceTime(0, asapScheduler),
      switchMap(() => of(this.findAllActivations())),
      filter(hasChanges),
      untilDestroyed(this)
    );
  }

  /**
   * Find all current activations and prepare single list of activations
   * sorted by descending priority.
   */
  private findAllActivations(): MediaChange[] {
    const mergeMQAlias = (change: MediaChange) => {
      const bp: OptionalBreakPoint = this.breakpoints.findByQuery(
        change.mediaQuery
      );
      return mergeAlias(change, bp);
    };

    const replaceWithPrintAlias = (change: MediaChange): MediaChange => {
      return this.printHook.isPrintEvent(change)
        ? this.printHook.updateEvent(change)
        : change;
    };

    const matchMediaActivations = this.matchMedia.activations
      .map((query) => new MediaChange(true, query))
      .map(replaceWithPrintAlias)
      .map(mergeMQAlias);

    return orderBy(matchMediaActivations, (activation) =>
      activation ? activation.priority || 0 : 0
    );
  }
}
/**
 * Find associated breakpoint (if any)
 */
function toMediaQuery(query: string, locator: BreakPointRegistry) {
  const bp = locator.findByAlias(query) || locator.findByQuery(query);
  return bp ? bp.mediaQuery : null;
}

/**
 * Split each query string into separate query strings if two queries are provided as comma
 * separated.
 */
function splitQueries(queries: string[]): string[] {
  return queries
    .map((query: string) => query.split(','))
    .reduce((a1: string[], a2: string[]) => a1.concat(a2))
    .map((query) => query.trim());
}

function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
