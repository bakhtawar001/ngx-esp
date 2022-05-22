import { MediaChange } from './media-change';
import { BreakPoint } from './breakpoints/breakpoint';

/**
 * Extends an object with the *enumerable* and *own* properties of one or more source objects,
 * similar to Object.assign.
 *
 * @param dest The object which will have properties copied to it.
 * @param sources The source objects from which properties will be copied.
 */
export function extendObject(dest: any, ...sources: any[]): any {
  for (const source of sources) {
    if (source != null) {
      for (const key in source) {
        // eslint-disable-next-line no-prototype-builtins
        if (source.hasOwnProperty(key)) {
          dest[key] = source[key];
        }
      }
    }
  }

  return dest;
}

const ALIAS_DELIMITERS = /(\.|-|_)/g;
function firstUpperCase(part: string) {
  const first = part.length > 0 ? part.charAt(0) : '';
  const remainder = part.length > 1 ? part.slice(1) : '';
  return first.toUpperCase() + remainder;
}

/**
 * Converts snake-case to SnakeCase.
 * @param name Text to UpperCamelCase
 */
function camelCase(name: string): string {
  return name
    .replace(ALIAS_DELIMITERS, '|')
    .split('|')
    .map(firstUpperCase)
    .join('');
}

/**
 * For each breakpoint, ensure that a Suffix is defined;
 * fallback to UpperCamelCase the unique Alias value
 */
export function validateSuffixes(list: BreakPoint[]): BreakPoint[] {
  list.forEach((bp: BreakPoint) => {
    if (!bp.suffix) {
      bp.suffix = camelCase(bp.alias); // create Suffix value based on alias
      bp.overlapping = !!bp.overlapping; // ensure default value
    }
  });
  return list;
}

/**
 * Merge a custom breakpoint list with the default list based on unique alias values
 *  - Items are added if the alias is not in the default list
 *  - Items are merged with the custom override if the alias exists in the default list
 */
export function mergeByAlias(
  defaults: BreakPoint[],
  custom: BreakPoint[] = []
): BreakPoint[] {
  const dict: { [key: string]: BreakPoint } = {};
  defaults.forEach((bp) => {
    dict[bp.alias] = bp;
  });
  // Merge custom breakpoints
  custom.forEach((bp: BreakPoint) => {
    if (dict[bp.alias]) {
      extendObject(dict[bp.alias], bp);
    } else {
      dict[bp.alias] = bp;
    }
  });

  return validateSuffixes(Object.keys(dict).map((k) => dict[k]));
}

export function mergeAlias(
  dest: MediaChange,
  source: BreakPoint | null
): MediaChange {
  dest = dest ? dest.clone() : new MediaChange();
  if (source) {
    dest.mqAlias = source.alias;
    dest.mediaQuery = source.mediaQuery;
    dest.suffix = source.suffix as string;
    dest.priority = source.priority as number;
  }
  return dest;
}
