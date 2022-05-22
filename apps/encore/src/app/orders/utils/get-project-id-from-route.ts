import { ActivatedRouteSnapshot } from '@angular/router';
import { getParamsObject } from '@cosmos/core';

/**
 * It's not yet 100% clear how to handle both pages for orders -
 * as a nested page on project overview tab and as a temporary
 * standalone page. For now let's grab project id from the route
 * state and make decisions on that. Might be needed to handle it
 * by `Order.ProjectId` property.
 */
export function getProjectIdFromRoute(
  route: ActivatedRouteSnapshot
): number | null {
  // TODO: maybe rename :id query param in projects router so that
  // it will be possible to recursively check all routes' data for
  // `projectId` query parameter.
  const paramMap = route?.parent?.parent?.paramMap;
  if (paramMap) {
    const params = getParamsObject(paramMap, ['id']);
    if (params && params.id) {
      return parseInt(params.id, 10);
    }
  }

  return null;
}
