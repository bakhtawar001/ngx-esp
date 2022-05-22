import { Injectable } from '@angular/core';

import { mergeByAlias } from '../utils';
import { BreakPoint } from './breakpoint';
import { sortBy } from 'lodash-es';

export type OptionalBreakPoint = BreakPoint | null;

const DEFAULT_BREAKPOINTS: BreakPoint[] = [
  {
    alias: 'xs',
    mediaQuery: 'screen and (min-width: 0px) and (max-width: 599.98px)',
    priority: 1000,
  },
  {
    alias: 'sm',
    mediaQuery: 'screen and (min-width: 600px) and (max-width: 959.98px)',
    priority: 900,
  },
  {
    alias: 'md',
    mediaQuery: 'screen and (min-width: 960px) and (max-width: 1279.98px)',
    priority: 800,
  },
  {
    alias: 'lg',
    mediaQuery: 'screen and (min-width: 1280px) and (max-width: 1919.98px)',
    priority: 700,
  },
  {
    alias: 'xl',
    mediaQuery: 'screen and (min-width: 1920px) and (max-width: 4999.98px)',
    priority: 600,
  },
  {
    alias: 'lt-sm',
    overlapping: true,
    mediaQuery: 'screen and (max-width: 599.98px)',
    priority: 950,
  },
  {
    alias: 'lt-md',
    overlapping: true,
    mediaQuery: 'screen and (max-width: 959.98px)',
    priority: 850,
  },
  {
    alias: 'lt-lg',
    overlapping: true,
    mediaQuery: 'screen and (max-width: 1279.98px)',
    priority: 750,
  },
  {
    alias: 'lt-xl',
    overlapping: true,
    priority: 650,
    mediaQuery: 'screen and (max-width: 1919.98px)',
  },
  {
    alias: 'gt-xs',
    overlapping: true,
    mediaQuery: 'screen and (min-width: 600px)',
    priority: -950,
  },
  {
    alias: 'gt-sm',
    overlapping: true,
    mediaQuery: 'screen and (min-width: 960px)',
    priority: -850,
  },
  {
    alias: 'gt-md',
    overlapping: true,
    mediaQuery: 'screen and (min-width: 1280px)',
    priority: -750,
  },
  {
    alias: 'gt-lg',
    overlapping: true,
    mediaQuery: 'screen and (min-width: 1920px)',
    priority: -650,
  },
];

/**
 * Registry of 1..n MediaQuery breakpoint ranges.
 */
@Injectable({ providedIn: 'root' })
export class BreakPointRegistry {
  readonly items: BreakPoint[] = sortBy(mergeByAlias(DEFAULT_BREAKPOINTS), [
    'priority',
  ]);

  /**
   * Memoized BreakPoint Lookups
   */
  private readonly findByMap = new Map<string, OptionalBreakPoint>();

  /**
   * Search breakpoints by alias (e.g. gt-xs)
   */
  findByAlias(alias: string): OptionalBreakPoint {
    return !alias
      ? null
      : this.findWithPredicate(alias, (bp) => bp.alias == alias);
  }

  findByQuery(query: string): OptionalBreakPoint {
    return this.findWithPredicate(query, (bp) => bp.mediaQuery == query);
  }

  /**
   * Get all the breakpoints whose ranges could overlapping `normal` ranges;
   * e.g. gt-sm overlaps md, lg, and xl
   */
  get overlappings(): BreakPoint[] {
    return this.items.filter((it) => it.overlapping == true);
  }

  /**
   * Get list of all registered (non-empty) breakpoint aliases
   */
  get aliases(): string[] {
    return this.items.map((it) => it.alias);
  }

  /**
   * Aliases are mapped to properties using suffixes
   * e.g.  'gt-sm' for property 'layout'  uses suffix 'GtSm'
   * for property layoutGtSM.
   */
  get suffixes(): string[] {
    return this.items.map((it) => (it.suffix ? it.suffix : ''));
  }

  /**
   * Memoized lookup using custom predicate function
   */
  private findWithPredicate(
    key: string,
    searchFn: (bp: BreakPoint) => boolean
  ): OptionalBreakPoint {
    let response = this.findByMap.get(key);
    if (!response) {
      response = this.items.find(searchFn) || null;
      this.findByMap.set(key, response);
    }
    return response || null;
  }
}
