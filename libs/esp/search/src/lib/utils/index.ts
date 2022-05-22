import {
  defaults,
  isFunction,
  isUndefined,
  merge,
  orderBy,
  partial,
  partialRight,
} from 'lodash-es';

export const DEFAULT_SORT = ['isRefined:desc', 'count:desc', 'name:asc'];

export function getFacetValues(attribute, opts) {
  const facetValues = extractNormalizedFacetValues(this, attribute);
  if (!facetValues) {
    return [];
    throw new Error(attribute + ' is not a retrieved facet.');
  }

  const options = defaults({}, opts, { sortBy: DEFAULT_SORT });

  if (Array.isArray(options.sortBy)) {
    // var order = formatSort(options.sortBy, SearchResults.DEFAULT_SORT);
    const order = [];
    if (Array.isArray(facetValues)) {
      return orderBy(facetValues, order[0], order[1]);
    }
    // If facetValues is not an array, it's an object thus a hierarchical facet object
    return recSort(partialRight(orderBy, order[0], order[1]), facetValues);
  } else if (isFunction(options.sortBy)) {
    if (Array.isArray(facetValues)) {
      return facetValues.sort(options.sortBy);
    }
    // If facetValues is not an array, it's an object thus a hierarchical facet object
    return recSort(partial(vanillaSortFn, options.sortBy), facetValues);
  }
  throw new Error(
    'options.sortBy is optional but if defined it must be ' +
      'either an array of string (predicates) or a sorting function'
  );
}

function isRefined(refinementList = {}, attribute, refinementValue) {
  const containsRefinements =
    !!refinementList[attribute] && refinementList[attribute].terms.length > 0;

  if (!containsRefinements || isUndefined(refinementValue)) {
    return containsRefinements;
  }

  const refinementValueAsString = '' + refinementValue;

  return (
    refinementList[attribute].terms.indexOf(refinementValueAsString) !== -1
  );
}

/**
 * Get the facet values of a specified attribute from a SearchResults object.
 * @private
 * @param {SearchResults} results the search results to search in
 * @param {string} attribute name of the faceted attribute to search for
 * @return {array|object} facet values. For the hierarchical facets it is an object.
 */
function extractNormalizedFacetValues(state, attribute) {
  const facet = state.Aggregations && state.Aggregations[attribute];

  if (!facet) {
    return [];
  }

  return Object.keys(facet).map(function (i) {
    return {
      name: facet[i],
      // count: facet.data[name],
      isRefined: isRefined(state.criteria.filters, attribute, facet[i]),
      // isExcluded: results._state.isExcludeRefined(attribute, name)
    };
  });

  // const predicate = { name: attribute };

  // return find(results.Aggregations, predicate);

  // if (results._state.isConjunctiveFacet(attribute)) {
  //   const facet = find(results.facets, predicate);
  //   if (!facet) {
  //     return [];
  //   }

  //   return Object.keys(facet.data).map(function(name) {
  //     return {
  //       name: name,
  //       count: facet.data[name],
  //       isRefined: results._state.isFacetRefined(attribute, name),
  //       isExcluded: results._state.isExcludeRefined(attribute, name),
  //     };
  //   });
  // } else if (results._state.isDisjunctiveFacet(attribute)) {
  //   const disjunctiveFacet = find(results.disjunctiveFacets, predicate);
  //   if (!disjunctiveFacet) {
  //     return [];
  //   }

  //   return Object.keys(disjunctiveFacet.data).map(function(name) {
  //     return {
  //       name: name,
  //       count: disjunctiveFacet.data[name],
  //       isRefined: results._state.isDisjunctiveFacetRefined(attribute, name),
  //     };
  //   });
  // } else if (results._state.isHierarchicalFacet(attribute)) {
  //   return find(results.hierarchicalFacets, predicate);
  // }
}

/**
 * Sort nodes of a hierarchical facet results
 * @private
 * @param {HierarchicalFacet} node node to upon which we want to apply the sort
 */
function recSort(sortFn, node) {
  if (!node.data || node.data.length === 0) {
    return node;
  }

  const children = node.data.map(partial(recSort, sortFn));
  const sortedChildren = sortFn(children);
  const newNode = merge({}, node, { data: sortedChildren });

  return newNode;
}

function vanillaSortFn(order, data) {
  return data.sort(order);
}
